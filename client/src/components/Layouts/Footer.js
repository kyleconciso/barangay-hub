import React from "react";
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
} from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        py: 4,
        mt: "10vw",
      }}
    >
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {/* Contact Information */}
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
              Email:{" "}
              <Link
                href="mailto:info@brgysanantonio.gov"
                color="inherit"
                sx={{ textDecoration: "none" }}
              >
                info@brgysanantonio.gov
              </Link>
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "row" : "column",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? 2 : 0,
                justifyContent: isMobile ? "space-around" : "flex-start",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link
                  href="/"
                  color="inherit"
                  underline="hover"
                  sx={{ textDecoration: "none" }}
                >
                  Home
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link
                  href="/articles"
                  color="inherit"
                  underline="hover"
                  sx={{ textDecoration: "none" }}
                >
                  News & Updates
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link
                  href="/forms"
                  color="inherit"
                  underline="hover"
                  sx={{ textDecoration: "none" }}
                >
                  Forms
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link
                  href="/contact"
                  color="inherit"
                  underline="hover"
                  sx={{ textDecoration: "none" }}
                >
                  Contact Us
                </Link>
              </Typography>
            </Box>
          </Grid>

          {/* Social Media Links */}
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

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Typography variant="body2" align="center">
          © {currentYear} Barangay San Antonio. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
