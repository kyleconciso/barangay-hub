const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(errorMessages.join(', '), 400)); // Combine all error messages
  }
  next();
};