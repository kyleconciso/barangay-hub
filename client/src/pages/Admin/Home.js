import React from 'react';
import { Typography, Container } from '@mui/material';

const AdminHome = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the admin dashboard. You can manage content and users here.
      </Typography>
    </Container>
  );
};

export default AdminHome;