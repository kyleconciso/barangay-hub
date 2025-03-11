import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Collapse, 
  useTheme 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { keyframes } from '@emotion/react';

const AnnouncementBar = ({ announcementMessage }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  if (!announcementMessage) {
    return null; // Don't render anything if there's no message
  }

  const handleClose = () => {
    setOpen(false);
  };

  // Define keyframes animations only for the background
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  `;

  const slideIn = keyframes`
    0% { transform: translateY(-100%); }
    100% { transform: translateY(0); }
  `;

  // Ping-pong gradient animation
  const shimmerPingPong = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <Collapse 
      in={open} 
      timeout={800}
    >
      <Box
        sx={{
          background: `linear-gradient(90deg, 
            ${theme.palette.warning.main} 0%, 
            ${theme.palette.warning.light} 33%, 
            ${theme.palette.warning.main} 66%, 
            ${theme.palette.warning.dark} 100%)`,
          backgroundSize: '300% 100%',
          animation: `${slideIn} 0.7s ease-out, ${shimmerPingPong} 8s infinite ease-in-out`,
          animationDelay: '0s, 0s',
          color: theme.palette.warning.contrastText,
          padding: '10px 16px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'calc(100% - 40px)',
            margin: '0 auto',
            position: 'relative'
          }}
        >
          <InfoOutlinedIcon 
            fontSize="small" 
            sx={{ marginRight: 1 }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              textShadow: '0 0 1px rgba(0,0,0,0.1)'
            }}
          >
            {announcementMessage}
          </Typography>
        </Box>
        
        <IconButton 
          size="small" 
          onClick={handleClose}
          aria-label="close"
          sx={{ 
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.palette.warning.contrastText,
            backgroundColor: 'rgba(0,0,0,0.05)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.15)',
            },
            transition: 'background-color 0.2s ease'
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Collapse>
  );
};

export default AnnouncementBar;