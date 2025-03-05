const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
console.log("chatController:", chatController);
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validate.middleware');

router.post('/',
    [
        body('message').notEmpty().isString(),
        validateRequest
    ],
    chatController.chat);

module.exports = router;