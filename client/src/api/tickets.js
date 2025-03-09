import api from './index';

export const getTickets = async () => {
  try {
    const response = await api.get('/tickets');
    return response.data; // backend returns tickets array
  } catch (error) {
    throw error;
  }
};

export const getTicket = async (id) => {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response.data; // backend returns ticket object
  } catch (error) {
    throw error;
  }
};

export const createTicket = async (data) => {
  try {
    const response = await api.post('/tickets', data);
    return response.data; // backend returns created ticket object
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (id, data) => {
  try {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data; // backend returns updated ticket object
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    await api.delete(`/tickets/${id}`);
    // deletion successful if no error
  } catch (error) {
    throw error;
  }
};