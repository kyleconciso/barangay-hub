import axios from 'axios';
import { auth } from './firebase'; 
import { baseURL } from './config'

const api = axios.create({
  baseURL: baseURL,
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