
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllTickets = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.TICKETS.GET_ALL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTicket = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.TICKETS.GET(id));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createTicket = async (ticketData) => {
    try{
        const response = await api.post(API_ENDPOINTS.TICKETS.GET_ALL, ticketData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}
export const updateTicket = async (id, ticketData) => {
    try{
        const response = await api.put(API_ENDPOINTS.TICKETS.GET(id), ticketData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}
export const addMessageToTicket = async (id, message) => {
  try {
    const response = await api.post(API_ENDPOINTS.TICKETS.ADD_MESSAGE(id), { content: message });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteTicket = async (id) => {
    try{
        const response = await api.delete(API_ENDPOINTS.TICKETS.GET(id));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}