import api from "./index";

export const getPages = async () => {
  try {
    const response = await api.get("/pages");
    return response.data; // backend returns pages array
  } catch (error) {
    throw error;
  }
};

export const getPage = async (id) => {
  try {
    const response = await api.get(`/pages/${id}`);
    return response.data; // backend returns page object
  } catch (error) {
    throw error;
  }
};

export const createPage = async (data) => {
  try {
    const response = await api.post("/pages", data);
    return response.data; // backend returns created page object
  } catch (error) {
    throw error;
  }
};

export const updatePage = async (id, data) => {
  try {
    const response = await api.put(`/pages/${id}`, data);
    return response.data; // backend returns updated page object
  } catch (error) {
    throw error;
  }
};

export const deletePage = async (id) => {
  try {
    await api.delete(`/pages/${id}`);
    // deletion successful if no error
  } catch (error) {
    throw error;
  }
};
