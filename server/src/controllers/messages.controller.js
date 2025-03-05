
const {
    createMessage,
    getMessageById,
    getMessagesByTicket,
    updateMessage,
    deleteMessage,
} = require('../models/message.model');
const { getTicketById } = require('../models/ticket.model');
const { getUserByEmail } = require('../models/user.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { roleCheck } = require('../middlewares/role.middleware');


exports.createMessage = async (req, res, next) => {
    try {
        const { ticketId, content } = req.body;
        const createdBy = req.user.uid;

        if (!ticketId || !content) {
            throw new AppError('Missing required fields', 400);
        }

        // Check if the ticket exists and if the user has permission
        const ticket = await getTicketById(ticketId);

        if (!ticket) {
            throw new AppError('Ticket not found', 404);
        }

        const user = await getUserByEmail(req.user.email);

        if (ticket.createdBy !== createdBy && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
            throw new AppError('Unauthorized to create a message for this ticket', 403);
        }

        const newMessage = {
            ticket: ticketId,
            content,
            createdBy,
            createdAt: new Date(),
        };

        const messageId = await createMessage(newMessage);
        return formatResponse(res, 201, { id: messageId }, 'Message created successfully');

    } catch (error) {
        next(error);
    }
};


exports.getMessagesForTicket = async (req, res, next) => {
    try {
        const { ticketId } = req.params;

        // Check ticket existence and user permission
        const ticket = await getTicketById(ticketId);
        if (!ticket) {
          throw new AppError("Ticket not found", 404);
        }
        const user = await getUserByEmail(req.user.email);

        if (ticket.createdBy !== req.user.uid && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
          throw new AppError("Unauthorized to view messages for this ticket", 403);
        }


        const messages = await getMessagesByTicket(ticketId);
        return formatResponse(res, 200, { messages }, 'Messages retrieved successfully');
    } catch (error) {
        next(error);
    }
};



exports.getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await getMessageById(id);

        if (!message) {
            throw new AppError('Message not found', 404);
        }

        // Check ticket existence and user permission (through the message's ticket)
        const ticket = await getTicketById(message.ticket);
        const user = await getUserByEmail(req.user.email);

        if (ticket.createdBy !== req.user.uid && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
          throw new AppError("Unauthorized to view this message", 403);
        }


        return formatResponse(res, 200, { message }, 'Message retrieved successfully');
    } catch (error) {
        next(error);
    }
};


exports.updateMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const message = await getMessageById(id);
        if (!message) {
            throw new AppError('Message not found', 404);
        }
                // Check ticket existence and user permission (through the message's ticket)
        const ticket = await getTicketById(message.ticket);
        const user = await getUserByEmail(req.user.email);

        if (ticket.createdBy !== req.user.uid && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
          throw new AppError("Unauthorized to update this message", 403);
        }


        const updatedMessage = {
            content,
        };

        await updateMessage(id, updatedMessage);
        return formatResponse(res, 200, null, 'Message updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await getMessageById(id);
        
        if (!message) {
            throw new AppError('Message not found', 404);
        }

        const ticket = await getTicketById(message.ticket);
        const user = await getUserByEmail(req.user.email);
        
        if (ticket.createdBy !== req.user.uid && user.type !== 'EMPLOYEE' && user.type !== 'ADMIN') {
            throw new AppError('Unauthorized to delete this message', 403);
        }

        await deleteMessage(id);
        return formatResponse(res, 200, null, 'Message deleted successfully');
    } catch (error) {
        next(error);
    }
};