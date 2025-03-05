const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validate.middleware');

router.post('/',
  [
    body('ticketId').notEmpty().isString(),
    body('content').notEmpty().isString(),
    validateRequest
  ],
  messagesController.createMessage
);

router.get('/ticket/:ticketId', messagesController.getMessagesForTicket);
router.get('/:id', messagesController.getMessage);

router.put('/:id',
    [
        body('content').notEmpty().isString(),
        validateRequest
    ],
    messagesController.updateMessage
);
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;