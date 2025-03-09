import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        py: 4, // Vertical padding
      }}
    >
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {/* contact information */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Brgy. San Antonio, Candon City,
            </Typography>
            <Typography variant="body2">Ilocos Sur, Philippines</Typography>
            <Typography variant="body2">Phone: +1 800 123 456 789</Typography>
            <Typography variant="body2">
              Email: <Link href="mailto:info@brgysanantonio.gov" color="inherit">info@brgysanantonio.gov</Link>
            </Typography>
          </Grid>

          {/* navigation links (optional) */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column', // stack on mobile, row on larger screen
                flexWrap: 'wrap', 
                gap: isMobile ? 2 : 0, // add gap on mobile
                justifyContent: isMobile ? 'space-around' : 'flex-start'
              }}
            >
                <Link href="/" color="inherit" underline="hover" sx={{ mb: 1, display: 'block' }}>
                    Home
                </Link>
                <Link href="/articles" color="inherit" underline="hover" sx={{ mb: 1, display: 'block' }}>
                    News & Updates
                </Link>
                <Link href="/forms" color="inherit" underline="hover" sx={{ mb: 1, display: 'block' }}>
                    Forms
                </Link>
                <Link href="/contact" color="inherit" underline="hover" sx={{ mb: 1, display: 'block' }}>
                    Contact Us
                </Link>
            </Box>
          </Grid>

          {/* social media links (optional) */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                href="https://www.facebook.com/handle"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://twitter.com/handle"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/handle" 
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="Instagram"
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* copyright information */}
        <Typography variant="body2" align="center">
          © {currentYear} Barangay San Antonio. All rights reserved.
        </Typography>
      </Container>
        <IconButton
            onClick={scrollToTop}
            sx={{
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText',
                '&:hover': {
                    backgroundColor: 'secondary.dark',
                },
            }}
            aria-label="Back to Top"
        >
            <KeyboardArrowUpIcon />
        </IconButton>
    </Box>
  );
};

export default Footer;