import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, Avatar, Grid, useTheme } from '@mui/material';
import { getArticle } from '../../api/articles';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import DOMPurify from 'dompurify';
import { formatDate } from '../../utils/dateUtils';
import Banner from '../../components/UI/Banner';
import { grey } from '@mui/material/colors'; 

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getArticle(id);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          setError(new Error('Article not found'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!article) return <div>Article not found.</div>;

  const getInitials = (author) => {
    if (!author) return '?';
    const parts = author.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase();
  };

  return (
    <>
      <Banner imageUrl={article.bannerURL} title={article.title} />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {getInitials(article.author)}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" color="text.primary">
              By {article.author || 'Unknown Author'}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {formatDate(article.createdAt)}
            </Typography>
          </Grid>
        </Grid>

        {/* quill content styling */}
        <Box sx={{
          '& p': { // Paragraphs
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '1em', // Add spacing between paragraphs
            color: theme.palette.text.primary, // Use theme text color
          },
          '& h1': { ...theme.typography.h1, marginTop: '1.5em', marginBottom: '0.5em' },
          '& h2': { ...theme.typography.h2, marginTop: '1.5em', marginBottom: '0.5em' },
          '& h3': { ...theme.typography.h3, marginTop: '1.5em', marginBottom: '0.5em' },
          '& h4': { ...theme.typography.h4, marginTop: '1.2em', marginBottom: '0.4em' },
          '& h5': { ...theme.typography.h5, marginTop: '1.2em', marginBottom: '0.4em' },
          '& h6': { ...theme.typography.h6, marginTop: '1em', marginBottom: '0.3em' },
          '& ul': { // Unordered lists
            paddingLeft: '2em',
            marginBottom: '1em',
            '& li': {
              listStyleType: 'disc',
              marginBottom: '0.5em',
            },
          },
          '& ol': { // Ordered lists
            paddingLeft: '2em',
            marginBottom: '1em',
            '& li': {
              listStyleType: 'decimal',
              marginBottom: '0.5em',
            },
          },
          '& blockquote': { // Blockquotes
            borderLeft: `4px solid ${theme.palette.primary.light}`, 
            paddingLeft: '1em',
            fontStyle: 'italic',
            marginBottom: '1em',
            color: theme.palette.text.secondary,
          },
          '& a': { // Links
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& strong': { // Bold text
            fontWeight: theme.typography.fontWeightBold,
          },
          '& em': { // Italic text
            fontStyle: 'italic',
          },
          '& pre': { // Preformatted text
            backgroundColor: grey[100], // Light grey background
            padding: '1em',
            borderRadius: 4,
            overflowX: 'auto', 
            fontFamily: '"Roboto Mono", monospace', // Use a monospace font
            fontSize: '0.9rem',
            lineHeight: 1.4,
          },
          '& img': { // Images
            maxWidth: '100%',
            height: 'auto',
            display: 'block', 
            borderRadius: 8,   
          }
        }}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
        </Box>
      </Container>
    </>
  );
};

export default ArticleDetail;