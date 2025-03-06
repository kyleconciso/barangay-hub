import React, { useState, useEffect } from 'react';
import { formService } from '../../services/formService';
import FormItem from './FormItem';
import FormDialog from './FormDialog';
import { List, Container, Typography, Button } from '@mui/material';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await formService.getAllForms();
        setForms(response.data.forms);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

   const handleFormCreated = (newForm) => {
        setForms(prevForms => [newForm, ...prevForms]);
    };
    const handleFormUpdated = (updatedForm) => {
        setForms((prevForms) =>
          prevForms.map((form) => (form.id === updatedForm.id ? updatedForm : form))
        );
    };

    const handleFormDeleted = (deletedFormId) => {
        setForms(prevForms => prevForms.filter(form => form.id !== deletedFormId));
    };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
        <Typography variant="h4" gutterBottom>Forms</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenCreateDialog(true)}>
            Add Form
        </Button>

        <FormDialog
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
            onCreate={handleFormCreated}
      />

      <List>
        {forms.map((form) => (
          <FormItem key={form.id} form={form} onUpdate={handleFormUpdated} onDelete={handleFormDeleted}/>
        ))}
      </List>
    </Container>
  );
};

export default FormList;