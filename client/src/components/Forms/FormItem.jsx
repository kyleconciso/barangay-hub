import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material'; // Removed Link
import DescriptionIcon from '@mui/icons-material/Description';

function FormItem({ form }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          {form.logoURL ? <img src={form.logoURL} alt={form.title} style={{ width: '100%', height: '100%' }} /> : <DescriptionIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<a href={form.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>{form.title}</a>}
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
          >
            {form.description}
          </Typography>
        }
      />
    </ListItem>
  );
}

export default FormItem;