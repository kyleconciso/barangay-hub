
import React from 'react';
import { List } from '@mui/material';
import TicketItem from './TicketItem';

const TicketList = ({ tickets }) => {

  if (!tickets || tickets.length === 0) {
    return <div>No tickets found.</div>;
  }

  return (
    <List>
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </List>
  );
};

export default TicketList;