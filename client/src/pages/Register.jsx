import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import Container from '@mui/material/Container';

function Register() {
  return (
    <Container component="main" maxWidth="md">
        <RegisterForm />
    </Container>
  );
}

export default Register;