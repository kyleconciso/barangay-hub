import api from './api';

export const formService = {
  createForm: async (formData) => {
    try {
      const response = await api.post('/forms', formData);
      return response.data;
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    }
  },
  getForm: async (id) => {
    try {
      const response = await api.get(`/forms/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching form:", error);
      throw error;
    }
  },
  getAllForms: async () => {
    try {
      const response = await api.get('/forms');
      return response.data;
    } catch (error) {
      console.error("Error fetching all forms:", error);
      throw error;
    }
  },
  updateForm: async (id, formData) => {
    try {
      const response = await api.put(`/forms/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating form:", error);
      throw error;
    }
  },
  deleteForm: async (id) => {
    try {
      const response = await api.delete(`/forms/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  },
};