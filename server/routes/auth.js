const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { validate, authRegisterSchema, authLoginSchema } = require('../utils/validation');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/register', validate(authRegisterSchema), async (req, res, next) => {
    try {
        const { email, password, displayName, phone } = req.body;

        const userRecord = await getAuth().createUser({
            email,
            password,
            displayName,
            phone,
        });


        const db = getFirestore();
        await db.collection('users').doc(userRecord.uid).set({
            email,
            displayName,
            phone,
            role: 'user', // default role
            createdAt: Timestamp.now(),
            disabled: false,
        });


        res.status(201).json({
            id: userRecord.uid,
            email,
            displayName,
            phone,
            role: 'user',
        });

    } catch (error) {
        console.error("POST /api/auth/register error:", error);
        if (error.code === 'auth/email-already-exists') {
            next({ status: 409, message: 'Email already in use', code: 'EMAIL_EXISTS' });
        } else if (error.code === 'auth/weak-password') {
            next({ status: 400, message: 'Password is too weak', code: 'WEAK_PASSWORD' });
        } else if (error.code === 'auth/invalid-phone-number') {
          next({status: 400, message: "Invalid phone number.", code: "INVALID_PHONE_NUMBER"})
        }
        else {
            next(error);
        }
    }
});


router.post('/login', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next({ status: 401, message: 'Missing or invalid authorization header', code: 'UNAUTHORIZED' });
        }
        const idToken = authHeader.split('Bearer ')[1];

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;


        const db = getFirestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return next({ status: 404, message: 'User data not found', code: 'USER_NOT_FOUND' });
        }

        const userData = userDoc.data();

        if (userData.disabled) {
            return next({ status: 403, message: 'User is disabled', code: 'USER_DISABLED' });
        }

        res.status(200).json({
            user: {
                id: userId,
                email: userData.email,
                displayName: userData.displayName,
                role: userData.role,
                phone: userData.phone
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        if (error.code === 'auth/id-token-expired') {
            next({ status: 401, message: 'Token expired', code: 'TOKEN_EXPIRED' });
        } else if (error.code === 'auth/id-token-revoked') {
            next({ status: 401, message: 'Token revoked', code: 'TOKEN_REVOKED' });
        } else if (error.code === 'auth/invalid-credential'){
            next({status: 401, message: "Invalid credential.", code: "INVALID_CREDENTIAL"})
        }
        else {
            next({ status: 401, message: 'Invalid token', code: 'INVALID_TOKEN' });
        }
    }
});

router.get('/me', authMiddleware, (req, res) => {
    const { id, email, displayName, role, phone } = req.user;
    res.status(200).json({ user: { id, email, displayName, role, phone } });
});

router.post('/logout', (req, res) => {
  res.status(204).send(); // 204 No Content
});

module.exports = router;