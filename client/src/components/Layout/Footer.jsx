import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        p: 2,
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Barangay Management System. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;