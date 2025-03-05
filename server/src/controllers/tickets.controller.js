const {
    createTicket,
    getTicketById,
    getAllTickets,
    updateTicket,
    deleteTicket,
    getTicketsByCreator
} = require('../models/ticket.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { roleCheck } = require('../middlewares/role.middleware');
const { getUserByEmail } = require('../models/user.model');

exports.createTicket = async (req, res, next) => {
    try {
        const { title, type } = req.body;
        const createdBy = req.user.uid;

        if (!title || !type) {
            throw new AppError('Missing required fields', 400);
        }

        const newTicket = {
            title,
            type,
            status: 'OPEN', // Default to OPEN
            assignedTo: null, // Initially unassigned
            createdAt: new Date(),
            createdBy,
            updatedAt: new Date(),
            updatedBy: createdBy,
        };

        const ticketId = await createTicket(newTicket);
        return formatResponse(res, 201, { id: ticketId }, 'Ticket created successfully');
    } catch (error) {
        next(error);
    }
};


exports.getTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await getTicketById(id);
        if (!ticket) {
            throw new AppError('Ticket not found', 404);
        }

      const user = await getUserByEmail(req.user.email);
        // Ownership check:  User can only access their own tickets, or if they are EMPLOYEE/ADMIN
      if (ticket.createdBy !== req.user.uid && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
            throw new AppError('Unauthorized', 403);
        }

        return formatResponse(res, 200, { ticket }, 'Ticket retrieved successfully');
    } catch (error) {
        next(error);
    }
};



exports.getAllTickets = [
    roleCheck(['EMPLOYEE', 'ADMIN']), // Only employees and admins can get all tickets
    async (req, res, next) => {
        try {
            const tickets = await getAllTickets();
            return formatResponse(res, 200, { tickets }, 'Tickets retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.getUserTickets = async (req, res, next) => {
    try {
        const tickets = await getTicketsByCreator(req.user.uid);
        return formatResponse(res, 200, { tickets }, 'Tickets retrieved successfully');
    } catch (error) {
        next(error);
    }
};



exports.updateTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, type, status, assignedTo } = req.body;
        const updatedBy = req.user.uid;

        const ticket = await getTicketById(id);
        if (!ticket) {
            throw new AppError('Ticket not found', 404);
        }
        const user = await getUserByEmail(req.user.email);

        // Ownership check
        if (ticket.createdBy !== req.user.uid && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
            throw new AppError('Unauthorized', 403);
        }

        const updatedTicket = {
            title,
            type,
            status,
            assignedTo, // Allow updating assignedTo
            updatedAt: new Date(),
            updatedBy,
        };

        await updateTicket(id, updatedTicket);
        return formatResponse(res, 200, null, 'Ticket updated successfully');

    } catch (error) {
        next(error);
    }
};



exports.deleteTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await getTicketById(id);
        if (!ticket) {
          throw new AppError("Ticket not found", 404);
        }
        const user = await getUserByEmail(req.user.email);

        // Ownership check
        if (ticket.createdBy !== req.user.uid && user.type !== 'ADMIN') {
            throw new AppError('Unauthorized', 403);
        }

        await deleteTicket(id);
        return formatResponse(res, 200, null, 'Ticket deleted successfully');
    } catch (error) {
        next(error);
    }
};