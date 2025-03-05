const { logger } = require('../utils/logger');

exports.requestLoggerMiddleware = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration_ms: duration,
            ip: req.ip,
            user: req.user ? req.user.email : 'anonymous',
        };

        logger.info('Incoming Request:', logData);
    });

    next();
};