
import api from './base';
import { API_ENDPOINTS } from '../utils/constants';

export const getSiteSettings = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.SETTINGS.GET);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateSiteSettings = async (settingsData) => {
  try {
    const response = await api.put(API_ENDPOINTS.SETTINGS.GET, settingsData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};