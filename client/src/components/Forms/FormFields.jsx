import React from 'react';
import { TextField } from '@mui/material';

const FormFields = ({ title, onTitleChange, description, onDescriptionChange, link, onLinkChange, logoURL, onLogoURLChange }) => {
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
        label="Description"
        type="text"
        fullWidth
        value={description}
        onChange={onDescriptionChange}
      />
      <TextField
        margin="dense"
        label="Link"
        type="url"
        fullWidth
        value={link}
        onChange={onLinkChange}
      />
      <TextField
        margin="dense"
        label="Logo URL (optional)"
        type="url"
        fullWidth
        value={logoURL}
        onChange={onLogoURLChange}
      />
    </>
  );
};

export default FormFields;