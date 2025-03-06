import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createForm = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forms`, formData);
    return response.data.data.id;
  } catch (error) {
    throw error;
  }
};

export const getFormById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forms/${id}`);
    return response.data.data.form;
  } catch (error) {
    throw error;
  }
};

export const getAllForms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forms`);
    return response.data.data.forms;
  } catch (error) {
    throw error;
  }
};

export const updateForm = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/forms/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteForm = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/forms/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const formsService = { createForm, getFormById, getAllForms, updateForm, deleteForm };
export default formsService;