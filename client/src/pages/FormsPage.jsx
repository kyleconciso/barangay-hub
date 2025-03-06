import React, { useState, useEffect } from 'react';
import { getAllForms } from '../services/forms.service';
import FormList from '../components/Forms/FormList';
import { Container, Typography } from '@mui/material';
import Loader from '../components/UI/Loader';
import ErrorMessage from '../components/UI/ErrorMessage';

function FormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await getAllForms();
        setForms(fetchedForms);
      } catch (err) {
        setError('Failed to load forms.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return <Loader />;
  }

    if (error) {
        return <ErrorMessage message={error}/>
    }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Available Forms
      </Typography>
      {forms.length > 0 ? (
        <FormList forms={forms} />
        ) : (
        <Typography>No forms available at this time.</Typography>
      )}
    </Container>
  );
}

export default FormsPage;