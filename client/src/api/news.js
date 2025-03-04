
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllNews = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.NEWS.GET_ALL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getNewsBySlug = async (slug) => {
  try {
    const response = await api.get(API_ENDPOINTS.NEWS.GET(slug));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createNews = async (newsData) => {
    try{
        const response = await api.post(API_ENDPOINTS.NEWS.GET_ALL, newsData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const updateNews = async (slug, newsData) => {
    try{
        const response = await api.put(API_ENDPOINTS.NEWS.GET(slug), newsData);
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}

export const deleteNews = async (slug) => {
    try{
        const response = await api.delete(API_ENDPOINTS.NEWS.GET(slug));
        return response.data;
    }
    catch(error){
        throw error.response.data;
    }
}