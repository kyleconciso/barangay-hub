import api from './index';

export const getForms = async () => {
  try {
    const response = await api.get('/forms');
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const getForm = async (id) => {
  try {
    const response = await api.get(`/forms/${id}`);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const createForm = async (data) => {
  try {
    const response = await api.post('/forms', data);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const updateForm = async (id, data) => {
  try {
    const response = await api.put(`/forms/${id}`, data);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const deleteForm = async (id) => {
  try {
    await api.delete(`/forms/${id}`);
    // deletion successful if no error
  } catch (error) {
    throw error;
  }
};