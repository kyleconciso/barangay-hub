// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { pageService } from '../services/pageService';
import { Typography, Container, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await pageService.getAllPages();
        // Filter for articles and sort by creation date
        const articles = response.data.pages
          .filter(page => page.type === 'ARTICLE')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5); // Get the latest 5
        setNews(articles);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

    const truncateContent = (content, maxLength = 200) => {
        if (!content) {
            return "";
        }
        const trimmedContent = content.trim(); //Remove leading/trailing whitespaces
        if (trimmedContent.length <= maxLength) {
          return trimmedContent;
        }
        return trimmedContent.substring(0, maxLength) + "...";
      };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        Welcome to the Barangay!
      </Typography>

      <Typography variant="h4" gutterBottom>
        Latest News
      </Typography>
      <Grid container spacing={3}>
        {news.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateContent(article.content)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/pages/${article.slug}`}>Read More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;