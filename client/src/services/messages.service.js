import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createMessage = async (ticketId, content) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, { ticketId, content });
    return response.data.data.id;
  } catch (error) {
    throw error;
  }
};

export const getMessagesByTicketId = async (ticketId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/messages/ticket/${ticketId}`);
    return response.data.data.messages;
  } catch (error) {
    throw error;
  }
};

export const getMessageById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/messages/${id}`);
        return response.data.data.message;
    } catch (error) {
        throw error;
    }
}

export const updateMessage = async (id, content) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/messages/${id}`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const messagesService = { createMessage, getMessagesByTicketId, getMessageById, updateMessage, deleteMessage };
export default messagesService;