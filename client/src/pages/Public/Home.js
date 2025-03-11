// client/src/pages/Public/Home.js
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getArticles } from '../../api/articles'; // Import getArticles
import parse from 'html-react-parser';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
    Divider,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import Banner from '../../components/UI/Banner';

const HomePublic = () => {
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);
  const { user, userType } = useAuth();
    const [bannerImage, setBannerImage] = useState("")
    const homePageBanner = "https://i.ibb.co/BVxPjCrZ/475172880-122193205580173185-8945588955944178897-n.jpg"; // homepage banner url


    const formatDate = (timestamp) => {
      if (!timestamp) return '';
        // handle firestore timestamp
        if (typeof timestamp === 'object' && timestamp._seconds) {
            return new Date(timestamp._seconds * 1000).toLocaleDateString();
        }

        const date = new Date(timestamp);
      return date.toLocaleDateString();
    }

    // Fetch latest 3 articles
    useEffect(() => {
      const fetchLatestArticles = async () => {
        try {
          const data = await getArticles();
            // sort articles by createdat
          const sortedArticles = [...data].sort((a, b) => {
              const dateA = a.createdAt?._seconds ? new Date(a.createdAt._seconds * 1000) : new Date(a.createdAt);
              const dateB = b.createdAt?._seconds ? new Date(b.createdAt._seconds * 1000) : new Date(b.createdAt);
              return dateB - dateA;
          });
          setArticles(sortedArticles.slice(0, 3)); // Get the latest 3
        } catch (err) {
          setArticlesError(err);
        } finally {
          setArticlesLoading(false);
        }
      };

      fetchLatestArticles();
    }, []);

  const submitTicketLink = user
    ? (userType === 'RESIDENT' ? '/user/tickets' : '/admin/tickets')
    : '/signup';

  useEffect(()=>{
    setBannerImage(homePageBanner)
  }, [])

  return (
    <>
        {/* Banner Image */}
        <Banner imageUrl={bannerImage} title="Welcome to Barangay San Antonio" />


      <Container maxWidth="lg">
        <Box mt={4} mb={8}>


          {/* Welcome Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Welcome to the official website of Barangay San Antonio!
            </Typography>
             <Typography variant="body1">
                 We are dedicated to serving our community and providing easy access to information and services. Explore our site to find the latest news, announcements, forms, and contact details.
            </Typography>

          </Paper>

            {/* Latest News */}
            <Box mb={4}>
              <Typography variant="h4" gutterBottom>
                Latest News
              </Typography>
              <Divider sx={{ mb: 2 }} />
               {articlesLoading ? (
                 <CircularProgress />
               ) : articlesError ? (
                  <Typography color="error">Error loading articles: {articlesError.message}</Typography>
               ) : (
                <Grid container spacing={3}>
                 {articles.map((article) => (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                   <Card>
                    <CardActionArea component={RouterLink} to={`/articles/${article.id}`}>
                        {article.imageURL && (
                         <CardMedia
                          component="img"
                          height="140"
                          image={article.imageURL}
                          alt={article.title}
                        />
                       )}
                       <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                         {article.title}
                        </Typography>
                           <Typography variant="body2" color="text.secondary">
                                          Published on {formatDate(article.createdAt)}
                           </Typography>
                       </CardContent>
                    </CardActionArea>
                   </Card>
                  </Grid>
                 ))}
                </Grid>
               )}
            </Box>



          {/* call to action (Submit a Ticket) */}
           <Paper elevation={3} sx={{ p: 3, backgroundColor: 'primary.main', color: 'white', textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Need Assistance?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Submit a ticket and we'll get back to you as soon as possible.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to={submitTicketLink}
                sx={{ textTransform: 'none' }}
              >
                 {user ? 'View My Tickets' : 'Sign Up to Submit a Ticket'}
              </Button>
            </Paper>
        </Box>
      </Container>
    </>
  );
};

export default HomePublic;