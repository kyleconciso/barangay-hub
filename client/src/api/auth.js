
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data; // throw server error
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
    //  Remove token locally
   localStorage.removeItem('authToken');
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};