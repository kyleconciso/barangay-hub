import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle } from '../../api/articles';
import parse from 'html-react-parser';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';

const ArticleDetailPublic = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(id);
        setArticle(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  if (!article) {
    return <Typography>Article not found.</Typography>;
  }

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        // handle firestore timestamp
        if (typeof timestamp === 'object' && timestamp._seconds) {
            return new Date(timestamp._seconds * 1000).toLocaleDateString();
        }
       const date = new Date(timestamp);
        return date.toLocaleDateString();
    }

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {article.title}
          </Typography>
          {article.imageURL && ( // Conditionally render the image
            <Box sx={{ mt: 2, mb: 3 }}>
              <img src={article.imageURL} alt={article.title} style={{ width: '100%', maxWidth: '800px', height: 'auto' }} />
            </Box>
          )}
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Published on {formatDate(article.createdAt)}
          </Typography>
          <Box sx={{ mt: 2 }}>{parse(article.content)}</Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ArticleDetailPublic;