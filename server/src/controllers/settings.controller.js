const {
    getSettings,
    updateSettings,
} = require('../models/settings.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { roleCheck } = require('../middlewares/role.middleware');

exports.getSettings = [
    roleCheck(['ADMIN']),
    async (req, res, next) => {
        try {
            const settings = await getSettings();
            return formatResponse(res, 200, { settings }, 'Settings retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.updateSettings = [
    roleCheck(['ADMIN']),
    async (req, res, next) => {
        try {
            const updatedSettings = req.body;  // Expect the entire settings object
             // Validate that updatedSettings contains only allowed keys
            const allowedKeys = ['googleGeminiKey', 'facebookPageId', 'facebookAccessToken'];
            for (const key in updatedSettings) {
                if (!allowedKeys.includes(key)) {
                    throw new AppError(`Invalid setting key: ${key}`, 400);
                }
            }
            await updateSettings(updatedSettings);
            return formatResponse(res, 200, null, 'Settings updated successfully');
        } catch (error) {
            next(error);
        }
    }
];