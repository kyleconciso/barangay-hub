
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllRequests = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.REQUESTS.GET_ALL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRequest = async (id) => {
    try{
        const response = await api.get(API_ENDPOINTS.REQUESTS.GET(id));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}
export const createRequest = async (requestData) => {
    try{
        const response = await api.post(API_ENDPOINTS.REQUESTS.GET_ALL, requestData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}
export const updateRequest = async (id, requestData) => {
    try{
        const response = await api.put(API_ENDPOINTS.REQUESTS.GET(id), requestData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}
export const deleteRequest = async (id) => {
    try{
        const response = await api.delete(API_ENDPOINTS.REQUESTS.GET(id));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}