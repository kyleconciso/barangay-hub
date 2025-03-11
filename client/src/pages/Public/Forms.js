import React, { useEffect, useState } from 'react';
import { getForms } from '../../api/forms';
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
    Link,
} from '@mui/material';

const FormsPublic = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const data = await getForms();
                setForms(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

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
                    Forms
                </Typography>
                <Grid container spacing={3}>
                    {forms.map((form) => (
                        <Grid item xs={12} sm={6} md={4} key={form.id}>
                            <Card>
                                <CardActionArea component={Link} href={`/forms/${form.id}`}>
                                    {form.imageURL && ( // Conditionally render the image
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={form.imageURL}
                                            alt={form.title}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {form.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {form.description}
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

export default FormsPublic;