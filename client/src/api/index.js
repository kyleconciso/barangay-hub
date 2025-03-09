import axios from 'axios';
import { auth } from './firebase'; 

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// request interceptor to add the firebase id token to the authorization header
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser; // use auth.currentuser instead of auth.user
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting ID token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;