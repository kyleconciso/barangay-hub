import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getArticles } from '../../api/articles';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
} from '@mui/material';


const ArticlesPublic = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);


    const formatDate = (timestamp) => {
      if (!timestamp) return '';
        // handle firestore timestamp
        if (typeof timestamp === 'object' && timestamp._seconds) {
            return new Date(timestamp._seconds * 1000).toLocaleDateString();
        }

        const date = new Date(timestamp);
      return date.toLocaleDateString();
    }

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


    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    News & Updates
                </Typography>
                <Grid container spacing={3}>
                    {articles.map((article) => (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Card>
                                <CardActionArea component={RouterLink} to={`/articles/${article.id}`}>
                                   {article.imageURL && ( // Conditionally render image
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
            </Box>
        </Container>
    );
};

export default ArticlesPublic;