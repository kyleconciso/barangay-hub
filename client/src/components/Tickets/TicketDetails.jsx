// src/components/Tickets/TicketDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketById } from '../../services/tickets.service';
import { getMessagesByTicketId, createMessage } from '../../services/messages.service';
import { Container, Typography, Paper, TextField, Button, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar} from '@mui/material';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
    const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const fetchTicketAndMessages = async () => {
      try {
        const fetchedTicket = await getTicketById(id);
        if (fetchedTicket) {
          setTicket(fetchedTicket);
          const fetchedMessages = await getMessagesByTicketId(id); // Fetch related messages
          setMessages(fetchedMessages);

        } else {
          setError('Ticket not found.');
        }
      } catch (err) {
        setError('Failed to load ticket details.');
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndMessages();
  }, [id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setMessageError('');
        setLoadingMessages(true);
        try {
            const newMessageId = await createMessage(id, newMessage);
            setMessages(prevMessages => [...prevMessages, {
                id: newMessageId,
                ticket: id,
                content: newMessage,
                createdBy: "CURRENT_USER_ID", 
                createdAt: new Date().toISOString()
            }]);
            setNewMessage(''); // Clear input
        } catch (error) {
            setMessageError(error.message || "Failed to send message.")
        } finally {
            setLoadingMessages(false)
        }
    }

  if (loading) {
    return <Loader />; // Show loading indicator
  }

  if (error) {
    return <ErrorMessage message={error} />; // Show error message
  }

  if (!ticket) {
    return <Typography>Ticket not found.</Typography>; // Handle case where ticket is null
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h4">{ticket.title}</Typography>
        <Typography variant="subtitle1">Type: {ticket.type}</Typography>
        <Typography variant="subtitle1">Status: {ticket.status}</Typography>
        {ticket.assignedTo && (
            <Typography variant="subtitle1">Assigned To: {ticket.assignedTo}</Typography>
        )}
        <Typography variant="body1">
            Created by: {ticket.createdBy} on {new Date(ticket.createdAt).toLocaleString()}
        </Typography>

        <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Messages</Typography>
                <List>
                {messages.map((message) => (
                <ListItem key={message.id}>
                <ListItemAvatar>
                    <Avatar>
                    {/*  display user initials or a default icon */}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                primary={message.content}
                secondary={`Sent by ${message.createdBy} on ${new Date(message.createdAt).toLocaleString()}`}
                />
            </ListItem>
            ))}
            </List>

            {/* Message Input */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={loadingMessages}
                sx = {{mr: 1}}
                onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={loadingMessages}>
                Send
            </Button>
            </Box>
            {messageError && <ErrorMessage message={messageError} />}
        </Box>
      </Paper>
    </Container>
  );
}

export default TicketDetails;