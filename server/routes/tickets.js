const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
  addMessageToTicket,
  deleteTicket
} = require('../services/firestoreService');
const {
  authMiddleware,
  roleMiddleware: { isEmployee, isAdmin },
} = require('../middleware/authMiddleware');
const {
  validate,
  ticketCreateSchema,
  ticketUpdateSchema,
  ticketAddMessageSchema,
} = require('../utils/validation');


// GET /api/tickets - Get all tickets (paginated, filtered by role)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.id;
    const role = req.user.role;
    const tickets = await getAllTickets(page, limit, userId, role);
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
});

// GET /api/tickets/:id -get specific ticket
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await getTicket(id);
    if (!ticket) {
      return next({ status: 404, message: 'Ticket not found', code: 'TICKET_NOT_FOUND' });
    }

    // Authorization check: Only the creator, employee, or admin can view
    if (req.user.role !== 'employee' && req.user.role !== 'admin' && ticket.createdBy !== req.user.id) {
      return next({ status: 403, message: 'Forbidden', code: 'FORBIDDEN' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
});

// POST /api/tickets - Create a new ticket (User)
router.post('/', authMiddleware, validate(ticketCreateSchema), async (req, res, next) => {
  try {
    const ticketData = req.body;
    const userId = req.user.id; // Get user ID from authMiddleware
    const newTicket = await createTicket(ticketData, userId);
    res.status(201).json(newTicket);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tickets/:id - Update a ticket (Employee/Admin)
router.put(
  '/:id',
  authMiddleware,
  isEmployee,
  validate(ticketUpdateSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const ticketData = req.body;
      const updatedTicket = await updateTicket(id, ticketData);
      res.status(200).json(updatedTicket);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/tickets/:id/assign (Employee only)
router.put('/:id/assign', authMiddleware, isEmployee, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body; //  Can be null (unassign)

    //  basic validation
    if (assignedTo === undefined) {
      return next({ status: 400, message: "assignedTo field is required", code: 'BAD_REQUEST' });
    }

    //  update
    await updateTicket(id, { assignedTo });
    res.status(200).json({ message: 'Ticket assigned successfully' });

  } catch (error) {
    next(error);
  }
});

// PUT /api/tickets/:id/status (Employee only)
router.put('/:id/status', authMiddleware, isEmployee, async(req, res, next) => {
    try{
        const {id} = req.params;
        const {status} = req.body;

        if(!status) return next({ status: 400, message: "Status field is required.", code: "BAD_REQUEST"})

        await updateTicket(id, {status});
        res.status(200).json({message: "Ticket status updated successfully."})
    }
    catch(error){
        next(error)
    }
})

// POST /api/tickets/:id/messages - Add a message to a ticket (User/Employee/Admin)
router.post(
  '/:id/messages',
  authMiddleware,
  validate(ticketAddMessageSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const messageData = req.body;
      const userId = req.user.id;

        // Authorization check:  Only related users can add messages.
        const ticket = await getTicket(id);

        if (!ticket) {
          return next({status: 404, message: 'Ticket not found', code: 'TICKET_NOT_FOUND'})
        }
        if(req.user.role !== 'employee' && req.user.role !== 'admin' && ticket.createdBy !== userId) {
          return next({status: 403, message: "Forbidden.", code: "FORBIDDEN"})
        }

      await addMessageToTicket(id, messageData, userId);
      res.status(201).json({ message: 'Message added successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/tickets/:id (Employee/Admin)
router.delete('/:id', authMiddleware, isEmployee, async(req, res, next) => {
  try{
    const { id } = req.params;
    await deleteTicket(id);
    res.status(204).send();
  }
  catch(error){
    next(error)
  }
})

module.exports = router;