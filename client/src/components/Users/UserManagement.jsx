import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/users.service';
import UserList from './UserList';
import { Container, Typography } from '@mui/material';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <UserList users={users} />
    </Container>
  );
}

export default UserManagement;