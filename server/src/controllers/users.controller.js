const {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserByEmail
} = require('../models/user.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { roleCheck } = require('../middlewares/role.middleware');
const { auth } = require('../services/firebase.service');

// Create user is handled by authController.signUp


exports.getUser = [
    roleCheck(['EMPLOYEE', 'ADMIN']), // Employees and Admins can get user details
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await getUserById(id);

            if (!user) {
                throw new AppError('User not found', 404);
            }
            return formatResponse(res, 200, { user }, 'User retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.getAllUsers = [
    roleCheck(['ADMIN']), // Only Admins can list all users
    async (req, res, next) => {
        try {
            const users = await getAllUsers();
            return formatResponse(res, 200, { users }, 'Users retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
];


exports.getResidents = [
    roleCheck(['EMPLOYEE', 'ADMIN']), // Employees and admins can get all RESIDENT type
    async (req, res, next) => {
        try {
            const users = await getAllUsers();
            const residents = users.filter(user => user.type === 'RESIDENT');
            return formatResponse(res, 200, { residents }, 'Residents retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
]

exports.updateUser = [
    roleCheck(['ADMIN']),  // Only admins can update user
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { firstName, lastName, phone, address, type } = req.body;
            const updatedBy = req.user.uid;

             // Check if user exists
            const existingUser = await getUserById(id);
            if (!existingUser) {
                throw new AppError('User not found', 404);
            }


            const updatedUser = {
                firstName,
                lastName,
                phone,
                address,
                type, // Allow admins to change user type
                updatedAt: new Date(),
                updatedBy,
            };

            await updateUser(existingUser.id, updatedUser);
            return formatResponse(res, 200, null, 'User updated successfully');

        } catch (error) {
            next(error);
        }
    }
];



exports.deleteUser = [
    roleCheck(['ADMIN']), // Only Admins can delete users
    async (req, res, next) => {
        try {
            const { id } = req.params;
             // Check if user exists
            const existingUser = await getUserById(id);
            if (!existingUser) {
                throw new AppError('User not found', 404);
            }


            // Delete user from Firebase Authentication
            await auth.deleteUser(id);
            // Delete user document from Firestore
            await deleteUser(id);

            return formatResponse(res, 200, null, 'User deleted successfully');
        } catch (error) {
             if (error.code === 'auth/user-not-found') {
                 next(new AppError('User not found in Firebase Authentication', 404));
            }
            next(error);
        }
    }
];