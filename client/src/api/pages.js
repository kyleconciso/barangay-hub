
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getPage = async (slug) => {
  try {
    const response = await api.get(API_ENDPOINTS.PAGES.GET(slug));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPage = async (pageData) => {
    try{
        const response = await api.post(API_ENDPOINTS.PAGES.GET_ALL, pageData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const updatePage = async (slug, pageData) => {
    try{
        const response = await api.put(API_ENDPOINTS.PAGES.GET(slug), pageData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const deletePage = async(slug) => {
    try{
        const response = await api.delete(API_ENDPOINTS.PAGES.GET(slug));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}