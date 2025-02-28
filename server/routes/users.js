const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser, deleteUser } = require('../services/firestoreService');
const { authMiddleware, roleMiddleware: { isEmployee, isAdmin } } = require('../middleware/authMiddleware');
const { validate, userUpdateSchema } = require('../utils/validation');

// GET /api/users - get all users (paginated, Employee/Admin)
router.get('/', authMiddleware, isEmployee, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const users = await getAllUsers(page, limit);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - get specific user (Employee/Admin)
router.get('/:id', authMiddleware, isEmployee, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    if (!user) {
      return next({ status: 404, message: 'User not found', code: 'USER_NOT_FOUND' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Update a user (Employee/Admin)
// Employees can update SOME user data, but NOT roles.  Admins can update roles.
router.put('/:id', authMiddleware, isEmployee, validate(userUpdateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    // prevent role changing
    if (req.user.role === 'employee' && userData.role) {
      delete userData.role; // remove role
    }
     if (req.user.role === 'employee' && userData.disabled) {
       delete userData.disabled
     }

    const updatedUser = await updateUser(id, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - del user (Admin only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;