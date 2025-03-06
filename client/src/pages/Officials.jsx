import React, { useState, useEffect } from 'react';
import { getPageBySlug } from '../services/pages.service';
import { Container, Typography } from '@mui/material';
import Loader from '../components/UI/Loader';
import ErrorMessage from '../components/UI/ErrorMessage';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

function Officials() {
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const page = await getPageBySlug('officials');
        if (page) {
          setPageContent(page.content);
        } else {
          setError('Officials page content not found.');
        }
      } catch (err) {
        setError('Failed to load officials page content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Barangay Officials
      </Typography>
      <ReactMarkdown remarkPlugins={[gfm]}>{pageContent}</ReactMarkdown>
    </Container>
  );
}

export default Officials;