import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
  Divider,
  Card,
  CardContent,
  Grid,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getMessages, createMessage } from '../../api/messages';
import { useAuth } from '../../hooks/useAuth';

const TicketMessages = () => {
  const { id: ticketId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  
  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await getMessages();
        const filteredMessages = fetchedMessages.filter(
          (message) => message.ticket === ticketId
        );
        setMessages(filteredMessages);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // set up a polling interval to check for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    
    // clean up interval on component unmount
    return () => clearInterval(interval);
  }, [ticketId]);
  
  // scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (newMessageContent.trim() === '') return;

    try {
      const newMessage = {
        ticket: ticketId,
        content: newMessageContent,
        createdBy: user.uid,
      };
      await createMessage(newMessage);
      // refresh messages after sending
      const updatedMessages = await getMessages();
      const filteredMessages = updatedMessages.filter(
        (message) => message.ticket === ticketId
      );
      setMessages(filteredMessages);
      setNewMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' | ' + 
           date.toLocaleDateString();
  };
  
  // determine if message is from current user
  const isCurrentUser = (messageUserId) => {
    return messageUserId === user.uid;
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          backgroundColor: theme.palette.primary.main, 
          color: 'white',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Typography variant="h6">
          Ticket #{ticketId}
        </Typography>
      </Paper>
      
      {/* messages container */}
      <Box 
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: theme.palette.grey[50],
          p: 2
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Error loading messages: {error.message}</Alert>
        ) : messages.length === 0 ? (
          <Alert severity="info">No messages yet. Start the conversation!</Alert>
        ) : (
          <Stack spacing={2}>
            {messages.map((message) => {
              const fromCurrentUser = isCurrentUser(message.createdBy);
              
              return (
                <Box 
                  key={message.id} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: fromCurrentUser ? 'flex-end' : 'flex-start',
                    mb: 1 
                  }}
                >
                  <Grid container spacing={1} sx={{ maxWidth: '80%' }}>
                    {!fromCurrentUser && (
                      <Grid item xs={1}>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                          {getInitials(message.createdBy)}
                        </Avatar>
                      </Grid>
                    )}
                    
                    <Grid item xs={fromCurrentUser ? 12 : 11}>
                      <Card 
                        sx={{ 
                          borderRadius: fromCurrentUser 
                            ? '15px 15px 0 15px' 
                            : '0 15px 15px 15px',
                          backgroundColor: fromCurrentUser 
                            ? theme.palette.primary.light
                            : 'white',
                          color: fromCurrentUser 
                            ? 'white' 
                            : 'inherit'
                        }}
                      >
                        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                          <Typography variant="body1">{message.content}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              mt: 0.5, 
                              textAlign: 'right',
                              opacity: 0.7
                            }}
                          >
                            {formatTime(message.createdAt)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>
      
      {/* message input */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          borderRadius: '0 0 4px 4px',
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder="Type your message..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mr: 1 }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage} 
            disabled={newMessageContent.trim() === ''}
            sx={{ 
              p: 1, 
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&.Mui-disabled': {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[500]
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketMessages;