import api from './api';

export const userService = {
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },
    getResidents: async () => {
        try {
            const response = await api.get('/users/type/resident')
            return response.data
        } catch(error) {
            console.error("Error fetching residents:", error);
            throw error
        }
    },
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};