// src/components/UI/ChatbotWidget.jsx
import React, { useState } from 'react';
import { chatService } from '../../services/chatService';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatbotWidget = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false); 


  const handleSendMessage = async () => {
    if (message.trim() === '') return;
     setLoading(true);
    const userMessage = { text: message, sender: 'user' };
    setChatHistory(prevHistory => [...prevHistory, userMessage]);
    setMessage('');

    try {
      const response = await chatService.sendMessage(message);
      const botMessage = { text: response.data.response, sender: 'bot' };
      setChatHistory(prevHistory => [...prevHistory, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
       const errorMessage = { text: "Error: Could not get response.", sender: 'bot' };
        setChatHistory([...chatHistory, errorMessage]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '1rem', // Changed to bottom
        right: '1rem',
        width: 300,
        maxWidth: '80%',
        zIndex: 1000,
        p: 2,
        backgroundColor: 'background.paper', 
        borderRadius: 2,
        boxShadow: 2, 
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>Chatbot</Typography>
      <Box sx={{ overflowY: 'auto', maxHeight: 200, mb: 2 }}>
        {chatHistory.map((msg, index) => (
            <Box key={index} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left', mb: 1 }}>
            <Paper elevation={1} sx={{ padding: 1, display: 'inline-block', maxWidth: '80%' }}>
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        {loading && <Typography variant="body1">Loading...</Typography>}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if(e.key === 'Enter') {
                handleSendMessage()
            }
          }}
        />
         <Button variant="contained" color="primary" onClick={handleSendMessage} endIcon={<SendIcon />} disabled={loading}>
            Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatbotWidget;