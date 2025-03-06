// src/controllers/auth.controller.js
const { auth } = require('../services/firebase.service');
const { createUser, getUserById } = require('../models/user.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');

exports.signUp = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone, address } = req.body;

        if (!email || !password || !firstName || !lastName) {
            throw new AppError('Missing required fields', 400);
        }

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
        });

        const newUser = {
            firstName,
            lastName,
            email,
            phone,
            address,
            type: 'RESIDENT',
            createdAt: new Date(),
            createdBy: userRecord.uid,
            updatedAt: new Date(),
            updatedBy: userRecord.uid
        };

        await createUser(userRecord.uid, newUser);
        return formatResponse(res, 201, { uid: userRecord.uid }, 'User created successfully');

    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            next(new AppError('The email address is already in use.', 409)); // 409 Conflict
        } else if (error.code === 'auth/invalid-email' || error.code === 'auth/weak-password') {
            next(new AppError('Invalid email or password format.', 400));
        }
        else {
            next(error);
        }

    }
};

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required', 400);
        }

        const userRecord = await auth.getUserByEmail(email); 
        const token = await auth.createCustomToken(userRecord.uid);

        return formatResponse(res, 200, { token }, 'Sign-in successful');
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          next(new AppError('Invalid email or password.', 401)); // 401 Unauthorized
        } else {
            next(error); 
        }

    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const user = await getUserById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return formatResponse(res, 200, { user }, 'User profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};