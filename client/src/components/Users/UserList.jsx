// src/components/Users/UserList.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import UserItem from './UserItem';
import { List, Container, Typography, Button } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response;
        if (loggedInUser.type === 'ADMIN') {
          response = await userService.getAllUsers();
          setUsers(response.data.users);
        } else if (loggedInUser.type === 'EMPLOYEE') {
          response = await userService.getResidents(); // Use the getResidents function
          setUsers(response.data.residents);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUser.type]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

    const handleUserUpdated = (updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    const handleUserDeleted = (deletedUserId) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== deletedUserId));
    };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
       {loggedInUser.type === 'ADMIN' && (
        <Button variant="contained" color="primary">
            Add User
        </Button>)}
      <List>
        {users.map((user) => (
          <UserItem key={user.id} user={user} onUpdate={handleUserUpdated} onDelete={handleUserDeleted}/>
        ))}
      </List>
    </Container>
  );
};

export default UserList;