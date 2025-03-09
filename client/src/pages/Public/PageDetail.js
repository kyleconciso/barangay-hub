import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, useTheme } from '@mui/material'; // Import useTheme
import { getPage } from '../../api/pages';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import DOMPurify from 'dompurify';
import { formatDate } from '../../utils/dateUtils';
import Banner from '../../components/UI/Banner';
import { grey } from '@mui/material/colors';

const PageDetail = ({ pageSlug }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); 

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const fetchedPage = await getPage(pageSlug);
        if (fetchedPage) {
          setPage(fetchedPage);
        } else {
          setError(new Error('Page not found'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [pageSlug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!page) return <div>Page not found.</div>;

  return (
    <>
      <Banner imageUrl={page.bannerURL} title={page.title} />
      <Container sx={{ py: 4 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {formatDate(page.createdAt)}
        </Typography>

        {/* quill content styling */}
        <Box sx={{
          '& p': {
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '1em',
            color: theme.palette.text.primary,
          },
          '& h1': { ...theme.typography.h1, marginTop: '1.5em', marginBottom: '0.5em' },
          '& h2': { ...theme.typography.h2, marginTop: '1.5em', marginBottom: '0.5em' },
          '& h3': { ...theme.typography.h3, marginTop: '1.5em', marginBottom: '0.5em' },
          '& h4': { ...theme.typography.h4, marginTop: '1.2em', marginBottom: '0.4em' },
          '& h5': { ...theme.typography.h5, marginTop: '1.2em', marginBottom: '0.4em' },
          '& h6': { ...theme.typography.h6, marginTop: '1em', marginBottom: '0.3em' },
          '& ul': {
            paddingLeft: '2em',
            marginBottom: '1em',
            '& li': {
              listStyleType: 'disc',
              marginBottom: '0.5em',
            },
          },
          '& ol': {
            paddingLeft: '2em',
            marginBottom: '1em',
            '& li': {
              listStyleType: 'decimal',
              marginBottom: '0.5em',
            },
          },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.primary.light}`,
            paddingLeft: '1em',
            fontStyle: 'italic',
            marginBottom: '1em',
            color: theme.palette.text.secondary,
          },
          '& a': {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& strong': {
            fontWeight: theme.typography.fontWeightBold,
          },
          '& em': {
            fontStyle: 'italic',
          },
          '& pre': { 
            backgroundColor: grey[100], // Light grey background
            padding: '1em',
            borderRadius: 4,
            overflowX: 'auto', 
            fontFamily: '"Roboto Mono", monospace', 
            fontSize: '0.9rem',
            lineHeight: 1.4,
          },
          '& img': { // Images
            maxWidth: '100%', // make images responsive
            height: 'auto',
            display: 'block', // remove extra space below images
            borderRadius: 8,  
          }
        }}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }} />
        </Box>
      </Container>
    </>
  );
};

export default PageDetail;