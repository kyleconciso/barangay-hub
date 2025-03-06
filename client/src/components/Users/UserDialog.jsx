import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { userService } from '../../services/userService';

const UserDialog = ({ open, onClose, user, onUpdate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('RESIDENT');

  useEffect(() => {
    if (user) {
      // Editing existing user
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setType(user.type || 'RESIDENT');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setType('RESIDENT');
    }
  }, [user]);

  const handleSubmit = async () => {
    const userData = { firstName, lastName, email, phone, address, type };

    try {
      if (user) {
        await userService.updateUser(user.id, userData);
        onUpdate && onUpdate({...user, ...userData}); //optimistic update

      } else {
        console.warn("Creating user via UserDialog is not recommended. Use Signup.");
      }
      onClose();
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setType('RESIDENT');
    } catch (error) {
      console.error("User update/create error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="First Name"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!user}
        />
        <TextField
          margin="dense"
          label="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Address"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="user-type-label">Type</InputLabel>
          <Select
            labelId="user-type-label"
            id="user-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={!user}
          >
            <MenuItem value="RESIDENT">Resident</MenuItem>
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {user ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;