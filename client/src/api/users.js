import api from './index';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data; // backend returns users array
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data; // backend returns user object
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data; // backend returns updated user object
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    // deletion successful if no error
  } catch (error) {
    throw error;
  }
};

// helper function to get users by type (for the ticket assignment dropdown)
export const getUsersByType = async (type) => {
  try {
    const response = await api.get(`/users?type=${type}`); 
    return response.data; // backend returns users array filtered by type
  } catch (error) {
    throw error;
  }
};