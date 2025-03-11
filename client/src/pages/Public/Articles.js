import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Skeleton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getArticles } from '../../api/articles';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { formatDate } from '../../utils/dateUtils';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
a
  useEffect(() => {
    const fetchArticlesData = async () => {
      setLoading(true);
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesData();
  }, []);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        News & Updates
      </Typography>

      <Grid container spacing={4}>
        {loading ? (
          // display skeletons while loading
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          // display articles when loaded
          articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/articles/${article.id}`}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={article.bannerURL || 'https://via.placeholder.com/600x400?text=No+Image'} // Use bannerURL or placeholder
                    alt={article.title}
                    sx={{ objectFit: 'cover' }} // Ensure image covers the area
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {formatDate(article.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* Display a short excerpt (first 150 characters) */}
                      {article.content.substring(0, 150)}...
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default ArticlesPage;