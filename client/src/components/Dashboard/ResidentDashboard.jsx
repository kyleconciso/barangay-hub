// src/components/Dashboard/ResidentDashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { ticketService } from '../../services/ticketService';
import TicketList from '../Tickets/TicketList'; // Import TicketList
import TicketDialog from '../Tickets/TicketDialog';

const ResidentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  const handleTicketCreated = (newTicket) => { //Handles new ticket to be added
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  }


  useEffect(() => {
      const fetchTickets = async() => {
        try {
            const response = await ticketService.getTicketsByCreator()
            setTickets(response.data.tickets)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
      }

      fetchTickets()

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Resident Dashboard
      </Typography>
      <Typography variant="h5">Welcome, {user.firstName} {user.lastName}!</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">My Tickets</Typography>
               <Button variant="contained" color="primary" onClick={() => setOpenCreateTicket(true)}>
                    Create New Ticket
                </Button>
                <TicketDialog
                    open={openCreateTicket}
                    onClose={() => setOpenCreateTicket(false)}
                    onCreate={handleTicketCreated} // Pass the callback
                />
              <TicketList tickets={tickets}  />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResidentDashboard;