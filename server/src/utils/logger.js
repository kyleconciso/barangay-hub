const winston = require('winston');

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss' 
    }),
    winston.format.errors({ stack: true }), 
    winston.format.splat(), 
    winston.format.json()
);

const logger = winston.createLogger({
    level: 'info', 
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Colorize
                winston.format.simple()
            )
        }),
    ],
});

module.exports = { logger };