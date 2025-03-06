import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../../services/pages.service';
import { Container, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import gfm from 'remark-gfm';


function ArticleItem() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getPageBySlug(slug);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Failed to load article.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!article) {
    return <Typography>Article not found.</Typography>;
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h3" gutterBottom>
          {article.title}
        </Typography>
        {article.createdAt && (<Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Published on: {new Date(article.createdAt).toLocaleDateString()}
        </Typography>)}
        <ReactMarkdown remarkPlugins={[gfm]}>{article.content}</ReactMarkdown>
      </Paper>
    </Container>
  );
}

export default ArticleItem;