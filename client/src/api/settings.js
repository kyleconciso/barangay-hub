import api from './index';

export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data; // backend returns settings object
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (data) => {
  try {
    const response = await api.put('/settings', data);
    return response.data; // backend returns updated settings object
  } catch (error) {
    throw error;
  }
};