const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { validate, authRegisterSchema, authLoginSchema } = require('../utils/validation');
const { getFirestore } = require('firebase-admin/firestore');
const { authMiddleware } = require('../middleware/authMiddleware');

// register new user
router.post('/register', validate(authRegisterSchema), async (req, res, next) => {
  try {
    const { email, password, displayName, phone } = req.body;

    // create user in firebase Authentication
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName,
    });

    // store additional user data
    const db = getFirestore();
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      phone,
      role: 'user', // default role
      createdAt: new Date(),
      disabled: false,
    });

    // success
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
    }
    else {
      next(error);
    }
  }
});



// Login
router.post('/login', validate(authLoginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // only token needed, firebase auth will handle rest
        const signIn = await getAuth().signInWithEmailAndPassword(email, password)

        const idToken = await signIn.user.getIdToken();

        // Fetch user data
        const db = getFirestore();
        const userDoc = await db.collection('users').doc(signIn.user.uid).get();

        if (!userDoc.exists) {
            // addutional check
            return next({ status: 404, message: 'User data not found', code: 'USER_NOT_FOUND' });
        }

        const userData = userDoc.data();
        if(userData.disabled) {
           return next({ status: 403, message: 'User is disabled', code: 'USER_DISABLED' });
        }

        res.status(200).json({
            token: idToken,
            user: {
                id: signIn.user.uid,
                email: userData.email,
                displayName: userData.displayName,
                role: userData.role,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        // auth errors
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            next({ status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
        } else if (error.code === 'auth/user-disabled'){
          next({status: 403, message: 'User is disabled', code: 'USER_DISABLED'})
        }
        else {
            next(error);
        }
    }
});

//get logged in user info
router.get('/me', authMiddleware, (req, res) => {
    // req.user populated by authMiddleware
    res.status(200).json({ user: req.user });
});

// logout
router.post('/logout', (req, res) => {
  res.status(204).send(); 
});

module.exports = router;