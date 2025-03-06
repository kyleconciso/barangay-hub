import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Typography, Container, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h5">Welcome, {user.firstName} {user.lastName}!</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" component={Link} to="/users">
            Manage Users
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" component={Link} to="/pages">
            Manage Pages
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" component={Link} to="/forms">
            Manage Forms
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" component={Link} to="/tickets"> {/*Added Ticket List for Admin*/}
            Manage Tickets
          </Button>
        </Grid>
        {/*  <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" component={Link} to="/settings">
            Settings
          </Button>
        </Grid>*/}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;