class AppError extends Error {
    constructor(message, statusCode, originalError = null) {
        super(message);
        this.statusCode = statusCode;
        this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = { AppError };