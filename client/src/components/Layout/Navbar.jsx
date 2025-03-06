import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/auth.service';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


function Navbar() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();


    const handleSignOut = async () => {
        try {
            await signOutUser();
            navigate('/sign-in'); // Redirect to sign-in page
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };


  // If the authentication state is still loading dont render the navbar yet
  if (loading) {
    return null; 
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon /> {/* todo */}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Barangay System
            </RouterLink>
          </Typography>

          {/* Guest User Links */}
          {!currentUser && (
            <>
              <Button color="inherit" component={RouterLink} to="/news">News</Button>
              <Button color="inherit" component={RouterLink} to="/officials">Officials</Button>
              <Button color="inherit" component={RouterLink} to="/forms">Forms</Button>
              <Button color="inherit" component={RouterLink} to="/sign-in">Sign In</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
             </>
          )}


           {/* Resident User Links */}
           {currentUser && currentUser.type === 'RESIDENT' && (
            <>
              <Button color="inherit" component={RouterLink} to="/news">News</Button>
              <Button color="inherit" component={RouterLink} to="/officials">Officials</Button>
              <Button color="inherit" component={RouterLink} to="/forms">Forms</Button>
              <Button color="inherit" component={RouterLink} to="/submit-ticket">Submit Ticket</Button>
              <Button color="inherit" component={RouterLink} to="/account-management">Account</Button>
              <Button color="inherit" component={RouterLink} to="/ticket-management">My Tickets</Button>
              <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
            </>
          )}

          {/* Common Links for Employee/Admin  */}
          {(currentUser && (currentUser.type === 'EMPLOYEE' || currentUser.type === 'ADMIN')) && (
            <>
                <Button color="inherit" component={RouterLink} to="/news">News</Button>
              <Button color="inherit" component={RouterLink} to="/officials">Officials</Button>
              <Button color="inherit" component={RouterLink} to="/forms">Forms</Button>

                <Button color="inherit" component={RouterLink} to="/employee/account-management">Account</Button>
                <Button color="inherit" component={RouterLink} to="/employee/ticket-management">Tickets</Button>
                <Button color="inherit" component={RouterLink} to="/employee/news-management">News Management</Button>
                <Button color="inherit" component={RouterLink} to="/employee/forms-management">Forms Management</Button>
                {currentUser.type === 'ADMIN' && (
                  <>
                    <Button color="inherit" component={RouterLink} to="/admin/user-management">User Management</Button>
                    <Button color="inherit" component={RouterLink} to="/admin/page-management">Page Management</Button>
                    <Button color="inherit" component={RouterLink} to="/admin/site-settings-management">Site Settings</Button>
                    </>
                )}
                 <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;