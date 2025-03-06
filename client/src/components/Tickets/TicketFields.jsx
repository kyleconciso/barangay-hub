import React from 'react';
import { TextField } from '@mui/material';

const TicketFields = ({ title, onTitleChange, type, onTypeChange, initialMessage, onInitialMessageChange }) => {
  return (
    <>
      <TextField
        margin="dense"
        label="Title"
        type="text"
        fullWidth
        value={title}
        onChange={onTitleChange}
      />
      <TextField
        margin="dense"
        label="Type"
        type="text"
        fullWidth
        value={type}
        onChange={onTypeChange}
      />
       <TextField
        margin="dense"
        label="Initial Message"
        type="text"
        fullWidth
        multiline
        rows={4}
        value={initialMessage}
        onChange={onInitialMessageChange}
      />
    </>
  );
};

export default TicketFields;