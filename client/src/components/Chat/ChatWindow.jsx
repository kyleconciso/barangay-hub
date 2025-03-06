import React, { useState } from 'react';
import { sendMessageToChatbot } from '../../services/chat.service';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'; // For a nice chat bubble effect
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../context/AuthContext';

function ChatWindow() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {currentUser} = useAuth();


    const handleSendMessage = async () => {
      if (!message.trim()) return;

      setError('');
      setLoading(true);
      const userMessage = { text: message, sender: 'user' };
      setChatHistory(prevHistory => [...prevHistory, userMessage]);
      setMessage(''); // Clear input after sending

      try {
          const botResponseText = await sendMessageToChatbot(message);
          const botMessage = { text: botResponseText, sender: 'bot' };
          setChatHistory(prevHistory => [...prevHistory, botMessage]);
      } catch (err) {
          setError(err.message || 'Failed to get response from chatbot.');
          const botMessage = { text: 'Error, no response.', sender: 'bot' };
          setChatHistory(prevHistory => [...prevHistory, botMessage]);

      } finally {
          setLoading(false);
      }
  };


    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px', 
          right: '20px', 
          width: '300px', 
          maxHeight: '400px', 
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <Typography variant="h6" sx={{ p: 2, backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
            Chat with Barangay AI
        </Typography>
        {currentUser ? (<Box sx={{ overflowY: 'auto', flexGrow: 1, p: 2 }}>
          {chatHistory.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
              <Avatar sx={{ bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.500', width: 24, height: 24, ml: msg.sender === 'user'? 1:0, mr: msg.sender==='bot'? 1:0 }}>
                {msg.sender === 'user' ? 'U' : 'B'}
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  borderRadius: '8px',
                  maxWidth: '70%',
                  backgroundColor: msg.sender === 'user' ? '#e0f7fa' : '#f5f5f5',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
           {error && <Typography color="error">{error}</Typography>}
        </Box>) : ( <Box sx={{ flexGrow: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
                Please sign in to chat.
            </Typography>
            </Box>
        )}
        <Box sx={{ p: 1, borderTop: '1px solid #ccc' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent newline on Enter
                handleSendMessage();
              }
            }}
            disabled={!currentUser}
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={loading || !currentUser}
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              ),
            }}
          />
        </Box>
      </Box>
    );
}

export default ChatWindow;