import React from 'react';
import { Container, Typography, Paper,  } from '@mui/material';
import { useAuth } from '../context/AuthContext';


function AccountManagement() {
    const {currentUser} = useAuth();

  return (
    <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{padding: 3, marginTop: 4}}>
            <Typography variant="h4" gutterBottom>
                Account Management
            </Typography>
            {currentUser ? (
                <>
                    <Typography variant='h6'>
                        Name: {currentUser.firstName} {currentUser.lastName}
                    </Typography>
                    <Typography variant='body1'>
                        Email: {currentUser.email}
                    </Typography>
                    <Typography variant='body1'>
                        Phone: {currentUser.phone || "N/A"}
                    </Typography>
                    <Typography variant='body1'>
                        Address: {currentUser.address || "N/A"}
                    </Typography>
                    {/* todo */}
                </>
            ) : (
                <Typography>
                    You are not logged in.
                </Typography>
            )}
        </Paper>
    </Container>
  )
}

export default AccountManagement