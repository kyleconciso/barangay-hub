import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken(); //  token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor 401
api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403) ) {
        // If unauthorized remove token and redirect to login
        const auth = getAuth();
        auth.signOut();
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // Force redirect
      }
      return Promise.reject(error);

    }
);


export default api;