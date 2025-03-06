import React, { useState, useEffect } from 'react';
import { getAllTickets, getUserTickets, updateTicket } from '../../services/tickets.service';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import { useAuth } from '../../context/AuthContext';
import { Container, Typography, Button } from '@mui/material';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let fetchedTickets;
        if (currentUser.type === 'RESIDENT') {
          fetchedTickets = await getUserTickets();
        } else if (currentUser.type === 'EMPLOYEE' || currentUser.type === 'ADMIN') {
          fetchedTickets = await getAllTickets();
        } else {
          setError('Unauthorized to view tickets.');
          return;
        }
        setTickets(fetchedTickets);
      } catch (err) {
        setError('Failed to load tickets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchTickets();
    }
  }, [currentUser]);


  const handleUpdateTicket = async (updatedTicketData) => {
    try {
      await updateTicket(currentTicket.id, updatedTicketData);
        setTickets(prevTickets =>
            prevTickets.map(t => (t.id === currentTicket.id ? { ...t, ...updatedTicketData } : t))
        );
      setIsEditing(false);
      setCurrentTicket(null);
    } catch (error) {
      console.error("Failed to update ticket", error);
      setError("Failed to update ticket.");
    }
  };

  const handleEdit = (ticket) => {
    setCurrentTicket(ticket);
    setIsEditing(true);
  }
    const handleCloseEdit = () => {
        setIsEditing(false);
        setCurrentTicket(null);
    }

    if (loading || !currentUser) {
        return <Loader />;
    }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {currentUser.type === 'RESIDENT' ? 'My Tickets' : 'All Tickets'}
      </Typography>
      <TicketList tickets={tickets} />
        {(currentUser.type === 'EMPLOYEE' || currentUser.type === 'ADMIN') && (
        <>
          <Button onClick={() => setIsEditing(true)}>Edit Ticket</Button>
            {isEditing && (
              <>
                <TicketForm onSubmit={handleUpdateTicket} ticket={currentTicket} isCreate={false} />
                <Button onClick={handleCloseEdit}>Cancel</Button>
                </>
            )}
        </>
      )}
    </Container>
  );
}

export default TicketManagement;