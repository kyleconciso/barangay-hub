import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser, deleteUser } from '../../services/users.service';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
  } from '@mui/material';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import Modal from '../UI/Modal'; // Import the Modal component

function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [editMode, setEditMode] = useState(false);  // State for edit mode
    const [editedUser, setEditedUser] = useState({});   // State for storing edited user data

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await getUserById(id);
                if (fetchedUser) {
                    setUser(fetchedUser);
                    setEditedUser(fetchedUser); // Initialize editedUser
                } else {
                    setError('User not found.');
                }
            } catch (err) {
                setError('Failed to load user details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleEdit = () => {
        setEditMode(true); // Switch on
    };

    const handleCancel = () => {
        setEditMode(false);       // Switch off
        setEditedUser(user);    // Reset any changes
    }

    const handleSave = async () => {
        try {
            await updateUser(id, editedUser); //update db
            setUser(editedUser);        // Update the state with new details
            setEditMode(false);         // Switch off edit
        } catch (error) {
            setError("Failed to update User.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser(id);
            setDeleteConfirmation(false); // Close
            navigate('/admin/user-management'); // Redirect
        } catch (error) {
            console.error('Failed to delete user:', error);
            setError('Failed to delete user.  Check server logs.');
        }
    }
    const openDeleteConfirmation = () => {
        setDeleteConfirmation(true);
    }

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation(false);
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!user) {
        return <Typography>User not found.</Typography>;
    }

  return (
    <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
            <Typography variant="h4" gutterBottom>
            User Details
            </Typography>
            {error && <ErrorMessage message={error} />}

            {/* Display User Information read only */}
            {!editMode && (
            <>
                <Typography variant="h6">Name: {user.firstName} {user.lastName}</Typography>
                <Typography variant="body1">Email: {user.email}</Typography>
                <Typography variant="body1">Phone: {user.phone || 'N/A'}</Typography>
                <Typography variant="body1">Address: {user.address || 'N/A'}</Typography>
                <Typography variant="body1">Type: {user.type}</Typography>

                {currentUser.type === "ADMIN" && (
                <>
                <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 2 }}>
                    Edit
                </Button>
                <Button variant="contained" color="error" onClick={openDeleteConfirmation}>
                    Delete
                </Button>
                </>)}
            </>
            )}

            {/* Edit Form Conditional Rendering */}
            {editMode && (
            <Box component="form" sx={{ mt: 2 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    value={editedUser.firstName || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                />
                <TextField
                margin="normal"
                fullWidth
                label="Last Name"
                value={editedUser.lastName || ''}
                onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                />
                <TextField
                margin="normal"
                fullWidth
                label="Email"
                value={user.email} // Email is NOT editable
                disabled
                />
                <TextField
                margin="normal"
                fullWidth
                label="Phone"
                value={editedUser.phone || ''}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                />
                <TextField
                margin="normal"
                fullWidth
                label="Address"
                value={editedUser.address || ''}
                onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                />

                <FormControl fullWidth margin="normal">
                <InputLabel id="user-type-label">User Type</InputLabel>
                <Select
                    labelId="user-type-label"
                    id="user-type"
                    value={editedUser.type}
                    label="User Type"
                    onChange={(e) => setEditedUser({ ...editedUser, type: e.target.value })}
                >
                    <MenuItem value="RESIDENT">Resident</MenuItem>
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                    Save
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                </Button>
                </Box>
            </Box>
            )}
        </Paper>
        <Modal
            open={deleteConfirmation}
            onClose={closeDeleteConfirmation}
            title="Confirm Delete"
            onConfirm={handleDelete}
            confirmText="Delete"
        >
            Are you sure you want to delete this user? This action is irreversible.
        </Modal>
    </Container>
  );
}

export default UserDetails;