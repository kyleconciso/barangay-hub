import React, { useState, useEffect } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Box, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ticketService } from '../../services/ticketService'; //For Ticket Updates todo future implementations
import { messageService } from '../../services/messageService';
import SendIcon from '@mui/icons-material/Send';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const TicketItem = ({ ticket }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    // Fetch messages for this ticket
    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await messageService.getMessagesByTicket(ticket.id);
          setMessages(response.data.messages);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }, [ticket.id]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
          const response = await messageService.createMessage({ ticketId: ticket.id, content: newMessage });
            setMessages([...messages, response.data]); //optimistic update
          setNewMessage(''); // Clear input
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

    if (loading) {
        return <Typography>Loading Messages...</Typography>
    }
    if (error) {
        return <Typography>Error: {error.Message}</Typography>
    }

    const isEditable = user && (user.type === 'ADMIN' || (user.type === 'EMPLOYEE')); //Only admins can update all ticket status.
    const isOwner = user && (user.id === ticket.createdBy)

  return (
    <ListItem key={ticket.id} divider>
      <ListItemText
        primary={`${ticket.title} - ${ticket.type} - ${ticket.status}`}
        secondary={`Created by: ${ticket.createdBy}`}
      />
      <ListItemSecondaryAction>
        {isEditable && (<IconButton edge="end" aria-label="edit">
          <EditIcon />
        </IconButton>)}
        {(isEditable || isOwner) && (<IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>)}
      </ListItemSecondaryAction>

       <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Messages:</Typography>
        {messages.length === 0 ? (<Typography>No messages yet.</Typography>) :
        (<>
        {messages.map((message) => (
          <Box key={message.id} sx={{ p: 1, my: 1, border: '1px solid grey', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>{message.createdBy}:</strong> {message.content}
            </Typography>
          </Box>
        ))}</>)}
        <Box sx={{ display: 'flex', alignItems: 'center', mt:1 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            endIcon={<SendIcon />}
            sx={{ ml: 1 }}
          >
            Send
          </Button>
        </Box>
      </Box>

    </ListItem>

  );
};

export default TicketItem;