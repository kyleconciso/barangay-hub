import React from 'react';
import Alert from '@mui/material/Alert';

function ErrorMessage({ message }) {
    return (
        message ? <Alert severity="error">{message}</Alert> : null
    );
}

export default ErrorMessage;