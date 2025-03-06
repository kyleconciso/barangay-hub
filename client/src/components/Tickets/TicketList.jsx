import React from 'react';
import { List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function TicketList({ tickets }) {
  return (
    <List>
      {tickets.map((ticket) => (
        <React.Fragment key={ticket.id}>
          <ListItem
            alignItems="flex-start"
            component={RouterLink}
            to={`/ticket-management/${ticket.id}`}
            sx={{ textDecoration: 'none' }}
          >
            <ListItemText
              primary={ticket.title}
              secondary={
                <>
                    {ticket.type} - {ticket.createdAt && new Date(ticket.createdAt).toLocaleDateString()}
                    <br />
                    <Chip label={ticket.status} color={
                        ticket.status === 'OPEN' ? 'primary' :
                        ticket.status === 'IN_PROGRESS' ? 'warning' :
                        'default'
                    } variant="outlined" size="small" sx={{mt: 0.5}}/>

                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default TicketList;