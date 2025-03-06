import api from './api';

export const authService = {
    login: async (email, password) => {
        try {
          const response = await api.post('/auth/signin', { email, password });
          return response.data; // { success: true, data: { token: "firebaseCustomToken" }, message: "Sign-in successful" }
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
};