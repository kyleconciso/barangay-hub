import api from './index';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data.data; // backend returns { success: true, data: userResult }
  } catch (error) {
    throw error;
  }
};

export const me = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data; // backend returns the user object directly
  } catch (error) {
    throw error;
  }
};