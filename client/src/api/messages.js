import api from "./index";

export const getMessages = async () => {
  try {
    const response = await api.get("/messages");
    return response.data; // backend returns messages array
  } catch (error) {
    throw error;
  }
};

export const getMessage = async (id) => {
  try {
    const response = await api.get(`/messages/${id}`);
    return response.data; // backend returns message object
  } catch (error) {
    throw error;
  }
};

// no getmessagesbyticketid, as the server handles filtering

export const createMessage = async (data) => {
  try {
    const response = await api.post("/messages", data);
    return response.data; // backend returns created message object
  } catch (error) {
    throw error;
  }
};

export const updateMessage = async (id, data) => {
  try {
    const response = await api.put(`/messages/${id}`, data);
    return response.data; // backend returns updated message object
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    await api.delete(`/messages/${id}`);
    // deletion successful if no error
  } catch (error) {
    throw error;
  }
};
