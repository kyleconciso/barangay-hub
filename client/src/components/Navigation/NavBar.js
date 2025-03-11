 
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UserDisplay from './UserDisplay';
import TopBar from './TopBar';

const NavBar = ({ children, contactButton }) => { // accept contactbutton prop
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {React.Children.map(children, (child) => (
          <ListItem key={child.props.to} disablePadding>
            <ListItemButton component={RouterLink} to={child.props.to}>
              <ListItemText primary={child.props.children} />
            </ListItemButton>
          </ListItem>
        ))}
         <ListItem key="contact-us-mobile" disablePadding> {/* Add Contact Us to mobile menu */}
            <ListItemButton component={RouterLink} to="/contact">
              <ListItemText primary="Contact Us" />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}> {/*CRUCIAL: Sticky positioning and z-index*/}
        <Toolbar sx={{ paddingY: '0px' }}>
          {/* Logo and Navigation Links (Left Side) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <RouterLink to="/">
              <img
                src="https://i.ibb.co/Ps6D83RM/logo.png"
                alt="Brgy. San Antonio Logo"
                style={{
                  height: '80px',
                  marginRight: '10px',
                  position: 'relative',
                  zIndex: 1, // make sure logo is also above the banner
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                  marginTop: '5px',
                  marginBottom: '-20px',
                }}
              />
            </RouterLink>

            {/* Conditionally render nav links or hamburger */}
            {isMobile ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {children}
              </Box>
            )}
          </Box>

          {/* User Display, Contact Us Button, and Hamburger (Right Side) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {contactButton} {/* Render Contact Us button here */}
            <UserDisplay />
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default NavBar;