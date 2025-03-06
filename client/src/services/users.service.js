import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data.data.user;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.data.users; // Return the array of users
  } catch (error) {
    throw error;
  }
};
export const getResidents = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/users/type/resident`);
        return response.data.data.residents;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    return response.data; // Return the success response
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const usersService = { getUserById, getAllUsers, getResidents, updateUser, deleteUser };
export default usersService;