// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { authService } from '../../services/authService';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { setToken } from '../../utils/storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // State for login errors
  const { setUser, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await authService.login(email, password);
      const customToken = response.data.token;

      // --- Firebase CLIENT-SIDE SDK ---
      const auth = getAuth(); // Initialize Firebase Auth (client-side)
      const userCredential = await signInWithCustomToken(auth, customToken);
      const idToken = await userCredential.user.getIdToken();
      // --- End Firebase Client-Side ---
      await setToken(idToken)
      const userProfile = await authService.getProfile(); //fetch user data including role
      setUser(userProfile.data.user); //update AuthContext
      setIsLoggedIn(true); // Set isLoggedIn in AuthContext
      navigate('/dashboard');  // Redirect to dashboard
    } catch (error) {
      // Handle login errors
      setLoginError(error.response?.data?.message || 'Login failed.');
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
          Sign in
        </Typography>
        {loginError && <Typography color="error">{loginError}</Typography>} {/* Display error */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;