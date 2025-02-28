const errorHandler = (err, req, res, next) => {
    console.error(err); // log error for debug

    const statusCode = err.status || 500;
    const errorCode = err.code || 'SERVER_ERROR';
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            code: errorCode,
            message: errorMessage,
        },
    });
};

module.exports = { errorHandler };