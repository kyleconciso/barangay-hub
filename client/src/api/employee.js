
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllEmployees = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.EMPLOYEES.GET_ALL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getEmployee = async (id) => {
    try{
        const response = await api.get(API_ENDPOINTS.EMPLOYEES.GET(id));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const createEmployee = async (employeeData) => {
    try {
        const response = await api.post(API_ENDPOINTS.EMPLOYEES.GET_ALL, employeeData);
        return response.data;
    } catch(error) {
        throw error.response.data
    }
}