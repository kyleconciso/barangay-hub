import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { getAllForms, createForm, updateForm, deleteForm } from '../../services/forms.service';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../UI/ErrorMessage';

function FormManagement() {
  const [forms, setForms] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentForm, setCurrentForm] = useState({ title: '', description: '', link: '', logoURL: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const fetchedForms = await getAllForms();
        setForms(fetchedForms);
      } catch (error) {
        console.error("Failed to fetch forms:", error);
        setError("Failed to load forms.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCreateOpen = () => {
    setCurrentForm({ title: '', description: '', link: '', logoURL: '' });
    setOpenCreateDialog(true);
  };
  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

  const handleEditOpen = (form) => {
    setCurrentForm(form);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const newId = await createForm(currentForm);
            setForms(prevForms => [...prevForms, { ...currentForm, id: newId }]); //optimistic update
            handleCreateClose(); // Close the dialog
            setError('');
        } catch (error) {
            console.error("Failed to create form:", error);
            setError('Failed to create form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
    try {
      await updateForm(currentForm.id, currentForm);
      setForms(prevForms =>
        prevForms.map(f => (f.id === currentForm.id ? currentForm : f))
      );
      handleEditClose();
        setError('');
    } catch (err) {
      console.error('Error updating form', err);
      setError("Failed to update form");

    } finally {
        setLoading(false);
    }
  };

    const handleDelete = async (formId) => {
        setLoading(true);
        try {
            await deleteForm(formId);
            setForms(prevForms => prevForms.filter(form => form.id !== formId));
            setError('');
        } catch(error) {
            console.error("Error deleting Form: ", error);
            setError("Failed to delete form");
        } finally {
            setLoading(false);
        }

    }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Form Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateOpen} sx={{ mb: 2 }}>
        Create New Form
      </Button>
        {error && <ErrorMessage message={error}/>}
        {loading && <Typography>Loading...</Typography>}
      <List>
        {forms.map((form) => (
          <ListItem key={form.id} divider>
            <ListItemText primary={form.title} secondary={form.description} />
            <Button onClick={() => handleEditOpen(form)} disabled={loading}>Edit</Button>
            <Button onClick={() => handleDelete(form.id)} color="error" disabled={loading}>Delete</Button>
          </ListItem>
        ))}
      </List>

      {/* Create Form Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCreateClose}>
        <DialogTitle>Create New Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
            value={currentForm.title}
            onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
            value={currentForm.description}
            onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Link"
            fullWidth
            variant="standard"
            value={currentForm.link}
            onChange={(e) => setCurrentForm({ ...currentForm, link: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Logo URL (Optional)"
            fullWidth
            variant="standard"
            value={currentForm.logoURL}
            onChange={(e) => setCurrentForm({ ...currentForm, logoURL: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
            value={currentForm.title}
            onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
            value={currentForm.description}
            onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Link"
            fullWidth
            variant="standard"
            value={currentForm.link}
            onChange={(e) => setCurrentForm({ ...currentForm, link: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Logo URL (Optional)"
            fullWidth
            variant="standard"
            value={currentForm.logoURL}
            onChange={(e) => setCurrentForm({ ...currentForm, logoURL: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default FormManagement;