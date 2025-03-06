import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';

function UserItem({ user }) {
  return (
    <ListItem
      button
      component={RouterLink}
      to={`/admin/user-management/${user.id}`}
      sx={{ textDecoration: 'none' }}
    >
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${user.firstName} ${user.lastName}`}
        secondary={user.email}
      />
    </ListItem>
  );
}

export default UserItem;