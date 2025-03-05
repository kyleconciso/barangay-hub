exports.formatResponse = (res, statusCode, data = null, message = null) => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        data,
        message,
    };
    return res.status(statusCode).json(response);
};