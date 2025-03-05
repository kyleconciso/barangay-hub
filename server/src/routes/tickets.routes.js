const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validate.middleware');

router.post('/',
    [
        body('title').notEmpty().isString(),
        body('type').notEmpty().isString(),
        validateRequest
    ],
    ticketsController.createTicket);
router.get('/:id', ticketsController.getTicket);
router.get('/', ticketsController.getAllTickets[0]);
router.get('/my/all', ticketsController.getUserTickets); // Route to get tickets for the logged-in user
router.put('/:id',
    [
        body('title').optional().isString(),
        body('type').optional().isString(),
        body('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'CLOSED']),
        body('assignedTo').optional().isString(), // Assuming assignedTo is a user ID
        validateRequest
    ],
    ticketsController.updateTicket);

router.delete('/:id', ticketsController.deleteTicket);

module.exports = router;