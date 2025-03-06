// src/components/Forms/FormDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import FormFields from './FormFields';
import { formService } from '../../services/formService';

const FormDialog = ({ open, onClose, form, onCreate, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [dialogError, setDialogError] = useState('')

  useEffect(() => {
    // If editing an existing form populate the fields
    if (form) {
      setTitle(form.title || '');
      setDescription(form.description || '');
      setLink(form.link || '');
      setLogoURL(form.logoURL || '');
    } else {
        //Clear form
        setTitle('');
        setDescription('');
        setLink('');
        setLogoURL('');
    }
  }, [form]);

  const handleSubmit = async () => {
     try {
        const formData = { title, description, link, logoURL };
        if (form) {
          // Update existing form
          const response = await formService.updateForm(form.id, formData);
          onUpdate(response.data) //optimistic update

        } else {
          // Create new form
          const response = await formService.createForm(formData);
          onCreate(response.data) //optimistic update

        }
        onClose();
      } catch (error) {
        setDialogError(error.response?.data?.message || 'An error occurred.');
        console.error("Form submission error:", error);
      }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form ? 'Edit Form' : 'Create Form'}</DialogTitle>
      <DialogContent>
           {dialogError && <Typography color="error">{dialogError}</Typography>}
        <FormFields
          title={title}
          onTitleChange={(e) => setTitle(e.target.value)}
          description={description}
          onDescriptionChange={(e) => setDescription(e.target.value)}
          link={link}
          onLinkChange={(e) => setLink(e.target.value)}
          logoURL={logoURL}
          onLogoURLChange={(e) => setLogoURL(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {form ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;