import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tickets`, ticketData);
    return response.data.data.id;
  } catch (error) {
    throw error;
  }
};

export const getTicketById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
    return response.data.data.ticket;
  } catch (error) {
    throw error;
  }
};

export const getAllTickets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets`);
    return response.data.data.tickets;
  } catch (error) {
    throw error;
  }
};

export const getUserTickets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tickets/my/all`);
        return response.data.data.tickets;
    } catch (error) {
        throw error;
    }
};

export const updateTicket = async (id, ticketData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tickets/${id}`, ticketData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ticketsService = { createTicket, getTicketById, getAllTickets, getUserTickets, updateTicket, deleteTicket };
export default ticketsService;