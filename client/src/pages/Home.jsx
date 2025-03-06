import React, { useState, useEffect } from 'react';
import { getPageBySlug } from '../services/pages.service';
import { Container, Typography } from '@mui/material';
import Loader from '../components/UI/Loader'; 
import ErrorMessage from '../components/UI/ErrorMessage';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';


function Home() {
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const page = await getPageBySlug('home');
        if (page) {
          setPageContent(page.content);
        } else {
          setError('Home page content not found.');
        }
      } catch (err) {
        setError('Failed to load home page content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  if (loading) {
    return <Loader />; //  loader while fetching
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Welcome to the Barangay!
      </Typography>
      <ReactMarkdown remarkPlugins={[gfm]}>{pageContent}</ReactMarkdown>
    </Container>
  );
}

export default Home;