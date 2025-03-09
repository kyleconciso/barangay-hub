import api from './index';

export const sendMessage = async (data) => { // changed to async to handle promises correctly
  try {
    const response = await api.post('/chat', data);
    return response.data; 
  } catch (error) {
    throw error;
  }
};