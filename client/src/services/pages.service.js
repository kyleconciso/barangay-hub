import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createPage = async (pageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pages`, pageData);
    return response.data.data.id;
  } catch (error) {
    throw error;
  }
};

export const getPageBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pages/${slug}`);
    return response.data.data.page;
  } catch (error) {
    throw error;
  }
};

export const getAllPages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pages`);
    return response.data.data.pages;
  } catch (error) {
    throw error;
  }
};

export const updatePage = async (slug, pageData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pages/${slug}`, pageData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePage = async (slug) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/pages/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const pagesService = { createPage, getPageBySlug, getAllPages, updatePage, deletePage };
export default pagesService;