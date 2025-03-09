import React from 'react';
import PublicNav from '../Navigation/PublicNav';
import { Container } from '@mui/material';
import Footer from './Footer'; 

const PublicLayout = ({ children = true }) => {
  return (
    <div>
      <PublicNav />
      <Container sx={{ flexGrow: 1 }}> {/* Add flexGrow: 1 */}
        {children}
      </Container>
      <Footer /> {/* render the footer */}
    </div>
  );
};

export default PublicLayout;