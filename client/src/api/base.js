import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use env var
  headers: {
    'Content-Type': 'application/json',
  },
});

//  request interceptor to attach  JWT 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // retrieve
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;