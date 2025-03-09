import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Box,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getArticles } from '../../api/articles';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Banner from '../../components/UI/Banner';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticlesData = async () => {
      setLoading(true);
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles.slice(0, 3)); // Show only the latest 3 articles
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Banner
        imageUrl="https://i.ibb.co/BVxPjCrZ/475172880-122193205580173185-8945588955944178897-n.jpg"
        title="Welcome to Barangay San Antonio"
      />

      <Container sx={{ py: 4 }}>
        {/* featured articles */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom align='center'>
            Latest News & Updates
          </Typography>
          <Grid container spacing={4}>
            {articles.map((article) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={article.bannerURL || 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={article.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {article.content.substring(0, 150)}...
                      </Typography>
                      <Box mt={2}>
                        <Button
                            size="small"
                            component={Link}
                            to={`/articles/${article.id}`}
                            variant="outlined"
                            color="primary"
                        >
                            Read More
                        </Button>
                      </Box>
                    </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={3} display="flex" justifyContent="center">
            <Button component={Link} to="/articles" variant="contained" color="primary">
                View All Articles
            </Button>
           </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* submit a ticket card */}
        <Card elevation={3} sx={{ p: 4, mb: 8 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom align='center'>
              Submit a Ticket
            </Typography>
            <Typography variant="body1" align='center' paragraph>
              Need assistance? Sign up to submit a ticket and we'll get back to you
              as soon as possible.
            </Typography>
            <Box mt={2} display="flex" justifyContent="center">
              <Button component={Link} to="/signup" variant="contained" color="primary">
                Sign Up
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* about section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align='center'>
            About Barangay San Antonio
          </Typography>
          <Typography variant="body1" align='center' paragraph>
            Barangay San Antonio is a vibrant community dedicated to serving its
            residents and we provide essential services and support to
            improve the quality of life for everyone.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom align='center'>
            Contact Us
          </Typography>
          <Typography variant="body1" align='center' paragraph>
            Have questions or need assistance?  Visit our <Link to="/contact">Contact Us</Link> page.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;