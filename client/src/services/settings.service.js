import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    return response.data.data.settings;
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/settings`, settingsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const settingsService = {getSettings, updateSettings}
export default settingsService;