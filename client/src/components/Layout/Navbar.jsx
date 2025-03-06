import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ChatbotWidget from '../UI/ChatbotWidget';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Barangay Management
          </RouterLink>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <ChatbotWidget />
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={RouterLink} to="/dashboard">
              Dashboard
            </Button>
            {(user.type === 'ADMIN' || user.type === 'EMPLOYEE') && (
              <Button color="inherit" component={RouterLink} to="/forms">Forms</Button>
            )}
            {(user.type === 'ADMIN' || user.type === 'EMPLOYEE') && (
                <Button color="inherit" component={RouterLink} to="/pages">Pages</Button>
            )}
            {user.type === 'ADMIN' && (
              <Button color="inherit" component={RouterLink} to="/users">Users</Button>
            )}
            <Button color="inherit" component={RouterLink} to="/tickets">
              Tickets
            </Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Signup
            </Button>
             <Button color="inherit" component={RouterLink} to="/officials">
              Officials
            </Button>
            <Button color="inherit" component={RouterLink} to="/pages">
              News
            </Button>
          </>
        )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;