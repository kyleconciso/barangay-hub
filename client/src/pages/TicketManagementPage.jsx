// src/pages/TicketManagementPage.jsx
import React from 'react';
// import TicketManagement from '../components/Tickets/TicketManagement'; // REMOVE THIS
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';

function TicketManagementPage() {
    return(
        <Container>
            <Outlet />
        </Container>
    )
}

export default TicketManagementPage;