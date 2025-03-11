import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getForm } from '../../api/forms';
import { Container, Typography, Box, Paper, Link, CircularProgress, Card, CardMedia, CardContent } from '@mui/material';

const FormDetailPublic = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const data = await getForm(id);
                setForm(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
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

    if (!form) {
        return <Typography>Form not found.</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                 <Card>
                    {form.imageURL && (  // Conditionally render the image
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
                       <Box mt={2}>
                        <Link href={form.link} target="_blank" rel="noopener noreferrer">
                            Go to Form
                        </Link>
                      </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default FormDetailPublic;