import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography, Box } from '@mui/material';

function TicketForm({ onSubmit, ticket, isCreate = true }) {
  const [title, setTitle] = useState(ticket ? ticket.title : '');
  const [type, setType] = useState(ticket ? ticket.type : '');
  const [status, setStatus] = useState(ticket ? ticket.status : 'OPEN'); // Default status
  const [assignedTo, setAssignedTo] = useState(ticket ? ticket.assignedTo || '' : ''); // Optional assignedTo

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); //Clear previous error
    setLoading(true); // Start loading
    try {
      const ticketData = {
        title,
        type,
        ...(status && !isCreate && {status}),     
        ...(assignedTo && !isCreate && {assignedTo}) 
      };

      await onSubmit(ticketData);
        
    } catch (error) {
        setError(error.message || "Failed to submit the form. Try again.")
    } finally {
        setLoading(false);
    }

  };

  return (
    <Container component="main" maxWidth="xs">
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography variant="h6">{isCreate ? "Create Ticket" : "Edit Ticket"}</Typography>

        <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <FormControl fullWidth margin="normal" required>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
                labelId="type-label"
                id="type"
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
            >
                <MenuItem value="Complaint">Complaint</MenuItem>
                <MenuItem value="Request">Request</MenuItem>
                <MenuItem value="Inquiry">Inquiry</MenuItem>
            </Select>
        </FormControl>
            {/* Status and assignedTo fields) */}
            {!isCreate && (
              <>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="OPEN">Open</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="CLOSED">Closed</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  margin="normal"
                  fullWidth
                  id="assignedTo"
                  label="Assigned To (User ID)"
                  name="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </>
            )}
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
        >
            {isCreate ? 'Submit' : 'Update'}
        </Button>
      </Box>
    </Container>
  );
}

export default TicketForm;