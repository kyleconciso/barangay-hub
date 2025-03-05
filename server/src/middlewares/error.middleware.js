const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errorHandler');
const { formatResponse } = require('../utils/responseFormatter');

exports.errorHandler = (err, req, res, next) => {
    const errorLogData = {
        timestamp: new Date().toISOString(), // Add timestamp explicitly
        method: req.method,
        url: req.originalUrl,
        errorName: err.name,
        errorMessage: err.message,
        stackTrace: err.stack, // Include stack trace
        user: req.user ? req.user.email : 'anonymous',
    };

    logger.error('Error during request:', errorLogData);

    if (err instanceof AppError) {
        return formatResponse(res, err.statusCode, null, err.message);
    }

    return formatResponse(res, 500, null, 'Internal Server Error');
};