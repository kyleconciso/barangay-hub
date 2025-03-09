import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup({
        firstName,
        lastName,
        email,
        password,
        address,
        phone,
      });
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        background: 'linear-gradient(135deg, #3f51b5 0%, #9c27b0 100%)'
      }}
    >
      <Grid container>
        {/* Logo and Branding Section - exactly 50% of screen */}
        <Grid 
          item 
          xs={12} 
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            color: 'white',
            height: '100vh'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="https://i.ibb.co/Ps6D83RM/logo.png"
              alt="Brgy. San Antonio Logo"
              style={{
                height: isMobile ? '100px' : '150px',
                marginBottom: '20px',
              }}
            />
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="bold" 
              sx={{
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              Barangay San Antonio
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                mt: 2, 
                textAlign: 'center',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Building a stronger community together
            </Typography>
          </Box>
        </Grid>

        {/* Signup Form Section - exactly 50% of screen */}
        <Grid 
          item 
          xs={12} 
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            height: '100vh'
          }}
        >
          <Paper 
            elevation={10} 
            sx={{ 
              p: 4, 
              width: '100%', 
              maxWidth: '500px',
              borderRadius: 2,
              backgroundColor: 'white', // solid white background, no transparency
            }}
          >
            <Typography variant="h4" align="center" mb={3} fontWeight="medium" color="primary">
              Create Account
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  borderRadius: 1.5,
                  py: 1.5,
                }}
              >
                Sign Up
              </Button>
            </form>
            
            <Box mt={3} textAlign="center">
              <Typography variant="body1">
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login"
                  sx={{ 
                    fontWeight: 'medium',
                    '&:hover': {
                      textDecoration: 'none'
                    }
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;