import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const sendMessageToChatbot = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data.data.response;
  } catch (error) {
    throw error;
  }
};

const chatService = { sendMessageToChatbot };
export default chatService;