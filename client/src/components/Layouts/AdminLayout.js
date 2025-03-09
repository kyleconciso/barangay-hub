import React from 'react';
import AdminNav from '../Navigation/AdminNav';
import { Container } from '@mui/material';
import Footer from './Footer';
import { Box } from '@mui/material';

const AdminLayout = ({ children = true }) => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <AdminNav />
      <Container sx={{
        flexGrow: 1
      }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminLayout;