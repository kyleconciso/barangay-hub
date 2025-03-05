const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

router.get('/', settingsController.getSettings[0]);
router.put('/', settingsController.updateSettings[0]);

module.exports = router;