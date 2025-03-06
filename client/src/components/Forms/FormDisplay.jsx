import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function FormDisplay({ form }) {
    if (!form) {
        return (
            <Container>
            <Typography variant="h4">Form Not Found</Typography>
            </Container>
        )
    }
    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
                <Typography variant="h4">{form.title}</Typography>
                <Typography variant="subtitle1">{form.description}</Typography>
                <a href={form.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                Open Form
                </a>
            </Paper>
        </Container>
  );
}

export default FormDisplay;