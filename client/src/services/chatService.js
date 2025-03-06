import api from './api';

export const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat', { message });
      return response.data;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      throw error;
    }
  },
};