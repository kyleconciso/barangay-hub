
import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import Container from '@mui/material/Container';

function SignIn() {
  return (
    <Container component="main" maxWidth="md">
        <LoginForm />
    </Container>
  );
}

export default SignIn;