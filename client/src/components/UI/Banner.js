import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Banner = ({ imageUrl, title }) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',       // ensure the image covers the entire area
        backgroundPosition: 'center',  // center the image horizontally and vertically
        backgroundRepeat: 'no-repeat',
        width: '100vw',                // full viewport width
        height: '300px',             
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // adjust opacity
        },
        overflow: 'hidden', 
        marginLeft: 'calc(-50vw + 50%)', 
      }}
    >
      {title && (
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            zIndex: 1,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default Banner;