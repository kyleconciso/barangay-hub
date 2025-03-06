// src/components/Users/UserFields.jsx
import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const UserFields = ({ firstName, onFirstNameChange, lastName, onLastNameChange, email, onEmailChange, phone, onPhoneChange, address, onAddressChange,type, onTypeChange }) => { //added type
  return (
    <>
      <TextField
        margin="dense"
        label="First Name"
        fullWidth
        value={firstName}
        onChange={onFirstNameChange}
      />
      <TextField
        margin="dense"
        label="Last Name"
        fullWidth
        value={lastName}
        onChange={onLastNameChange}
      />
      <TextField
        margin="dense"
        label="Email"
        fullWidth
        value={email}
        onChange={onEmailChange}

      />
      <TextField
        margin="dense"
        label="Phone"
        fullWidth
        value={phone}
        onChange={onPhoneChange}
      />
      <TextField
        margin="dense"
        label="Address"
        fullWidth
        value={address}
        onChange={onAddressChange}
      />
      <FormControl fullWidth margin="dense">
          <InputLabel id="user-type-label">Type</InputLabel>
          <Select
            labelId="user-type-label"
            id="user-type"
            value={type}
            onChange={onTypeChange}
          >
            <MenuItem value="RESIDENT">Resident</MenuItem>
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
    </>
  );
};

export default UserFields;