import React from 'react';
import { Typography, Container } from '@mui/material';

const UserHome = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome, User!
      </Typography>
      <Typography variant="body1">
        This is your dashboard. You can manage your tickets here.
      </Typography>
    </Container>
  );
};

export default UserHome;