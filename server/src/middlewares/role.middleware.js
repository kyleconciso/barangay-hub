const { AppError } = require('../utils/errorHandler');
const { getUserByEmail } = require('../models/user.model');

exports.roleCheck = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await getUserByEmail(req.user.email);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            if (!allowedRoles.includes(user.type)) {
                throw new AppError('Forbidden: Insufficient permissions', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};