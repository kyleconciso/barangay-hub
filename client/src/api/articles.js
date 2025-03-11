import api from "./index";

export const getArticles = async () => {
  try {
    const response = await api.get("/articles");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticle = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createArticle = async (data) => {
  try {
    const response = await api.post("/articles", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateArticle = async (id, data) => {
  try {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    await api.delete(`/articles/${id}`);
    // no data to return, deletion successful if no error is thrown
  } catch (error) {
    throw error;
  }
};
