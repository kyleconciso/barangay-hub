import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Link,
  Skeleton,
  CardActionArea, 
} from '@mui/material';
import { getForms } from '../../api/forms';
import ErrorMessage from '../../components/UI/ErrorMessage';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormsData = async () => {
      try {
        setLoading(true);
        const fetchedForms = await getForms();
        setForms(fetchedForms);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormsData();
  }, []);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Forms
      </Typography>

      <Grid container spacing={4}>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          forms.map((form) => (
            <Grid item key={form.id} xs={12} sm={6} md={4}>
              <CardActionArea
                component={Link}
                href={form.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {form.logoURL && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={form.logoURL}
                      alt={form.title}
                      sx={{ objectFit: 'contain' }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {form.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {form.description}
                    </Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Forms;