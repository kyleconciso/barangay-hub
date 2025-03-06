import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../../services/pages.service';
import { Container, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import gfm from 'remark-gfm';

function PageDisplay() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchedPage = await getPageBySlug(slug);
        if (fetchedPage) {
          setPage(fetchedPage);
        } else {
          setError('Page not found.');
        }
      } catch (err) {
        setError('Failed to load page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!page) {
    return <Typography>Page not found.</Typography>;
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h3" gutterBottom>
          {page.title}
        </Typography>
        <ReactMarkdown remarkPlugins={[gfm]}>{page.content}</ReactMarkdown>
      </Paper>
    </Container>
  );
}

export default PageDisplay;