const express = require('express');
const router = express.Router();
const { getSiteSettings, updateSiteSettings } = require('../services/firestoreService');
const { authMiddleware, roleMiddleware: { isAdmin } } = require('../middleware/authMiddleware');
const { validate, siteSettingsUpdateSchema } = require('../utils/validation');



// GET /api/settings - get site settings (Admin)
router.get('/', authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const settings = await getSiteSettings();
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings - update site settings (Admin)
router.put('/', authMiddleware, isAdmin, validate(siteSettingsUpdateSchema), async (req, res, next) => {
  try {
    const settingsData = req.body;
    const updatedSettings = await updateSiteSettings(settingsData);
    res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;