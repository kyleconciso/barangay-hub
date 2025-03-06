// src/components/Auth/Signup.jsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = { email, password, firstName, lastName, phone, address };
      const response = await authService.signup(userData);
      navigate('/login')
      console.log("Signup successful:", response);
    } catch (error) {
      setSignupError(error.response?.data?.message || 'Signup failed');
      console.error("Signup error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {signupError && <Typography color="error">{signupError}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="address"
            label="Address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;