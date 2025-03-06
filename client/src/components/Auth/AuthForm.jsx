
import React from 'react';
import { TextField, Button } from '@mui/material';

const AuthForm = ({ onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      {children} {/* Render children (form fields) here */}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default AuthForm;