// src/services/ticketService.js
import api from './api';

export const ticketService = {
  createTicket: async (ticketData, initialMessage) => {
    try {
      const data = {
        ...ticketData,
        content: initialMessage
      };
      const response = await api.post('/tickets', data);
      return response.data;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },
  getTicket: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  },
  getAllTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      throw error;
    }
  },
    getTicketsByCreator: async (creatorId) => {
        try {
            const response = await api.get('/tickets/my/all')
            return response.data
        } catch (error) {
            console.error("Error fetching user tickets", error)
            throw error
        }
    },
  updateTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  },
  deleteTicket: async (id) => {
    try {
      const response = await api.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  },
};