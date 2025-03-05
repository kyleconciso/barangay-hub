const { auth } = require('../services/firebase.service');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { getUserByEmail } = require('../models/user.model');

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; // Attach the decoded token to the request
    next();
  } catch (error) {
     if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-expired') {
        next(new AppError('Unauthorized: Invalid or expired token', 401));
    }
    next(error);
  }
};