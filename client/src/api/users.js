
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllUsers = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.USERS.GET_ALL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.USERS.GET(id));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (id, userData) => {
    try{
        const response = await api.put(API_ENDPOINTS.USERS.GET(id), userData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const deleteUser = async (id) => {
    try{
        const response = await api.delete(API_ENDPOINTS.USERS.GET(id));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}