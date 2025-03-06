//todo
import api from './api';

export const messageService = {
  createMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
        throw new Error("Failed to create Message", error);
    }
  },
  getMessageById: async (id) => {
    try {
      const response = await api.get(`/messages/${id}`);
      return response.data;
    } catch (error) {
        throw new Error("Failed to get Message", error);
    }
  },

  getMessagesByTicket: async (ticketId) => {
    try {
      const response = await api.get(`/messages/ticket/${ticketId}`);
      return response.data;
    } catch (error) {
        throw new Error("Failed to get Message by Ticket", error);
    }
  },

  updateMessage: async (id, updatedData) => {
    try {
      const response = await api.put(`/messages/${id}`, updatedData);
      return response.data
    } catch (error) {
        throw new Error("Failed to update Message", error);
    }
  },

  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data
    } catch (error) {
        throw new Error("Failed to delete Message", error);
    }
  },
};