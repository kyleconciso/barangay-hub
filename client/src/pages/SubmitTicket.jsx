import React from 'react';
import TicketForm from '../components/Tickets/TicketForm';
import { createTicket } from '../services/tickets.service';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function SubmitTicket() {
    const navigate = useNavigate();
    const {currentUser} = useAuth();

    const handleSubmit = async (ticketData) => {
        try {
            const newTicketId = await createTicket(ticketData);
            navigate(`/ticket-management/${newTicketId}`); //redirect to ticket created
        } catch (error) {
            console.error("Failed to create ticket:", error);
        }
    };
    
    return (
        <Container>
            <Typography variant='h4'>
                Submit a Ticket
            </Typography>
            <TicketForm onSubmit={handleSubmit} />
        </Container>
    )
}

export default SubmitTicket