const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/profile', authMiddleware, authController.getUserProfile);

module.exports = router;