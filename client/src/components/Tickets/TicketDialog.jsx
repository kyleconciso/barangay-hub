import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import TicketFields from './TicketFields';
import { ticketService } from '../../services/ticketService';

const TicketDialog = ({ open, onClose, ticket, onCreate }) => { 
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [initialMessage, setInitialMessage] = useState(''); // Added initial message state
  const [dialogError, setDialogError] = useState('');


  useEffect(() => {
    // If editing an existing ticket populate the fields
    if (ticket) {
      setTitle(ticket.title || '');
      setType(ticket.type || '');
    } else {
       //Clear form
        setTitle('');
        setType('');
        setInitialMessage('');
    }
  }, [ticket]);

  const handleSubmit = async () => {
    try{
        const ticketData = { title, type };
        const response = await ticketService.createTicket(ticketData, initialMessage); //Pass to service
        onCreate(response.data);
        onClose();
    } catch(error) {
        setDialogError(error.response?.data?.message || 'An error occurred.');
        console.error("Ticket Creation Error", error)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{ticket ? 'Edit Ticket' : 'Create Ticket'}</DialogTitle>
      <DialogContent>
        {dialogError && <Typography color="error">{dialogError}</Typography>}
        <TicketFields
          title={title}
          onTitleChange={(e) => setTitle(e.target.value)}
          type={type}
          onTypeChange={(e) => setType(e.target.value)}
          initialMessage={initialMessage}  // Pass to TicketFields
          onInitialMessageChange={(e) => setInitialMessage(e.target.value)} //Update the state
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {ticket ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDialog;