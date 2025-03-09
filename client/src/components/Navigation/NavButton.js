
import React from 'react';
import { Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NavButton = ({ to, children, icon, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      sx={{
        fontWeight: 500,
        display: 'flex',
        gap: 0,
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent', // semi-transparent background
        borderRadius: '8px', // rounded corners
        paddingX: 1.5,
        paddingY: 0.5,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)', // slightly more opaque on hover
        },
        // removed borderbottom styles
      }}
      {...props}
      startIcon={icon}
    >
      {children}
    </Button>
  );
};

export default NavButton;