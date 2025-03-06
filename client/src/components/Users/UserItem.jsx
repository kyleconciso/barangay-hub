import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userService } from '../../services/userService';
import ConfirmDialog from '../UI/ConfirmDialog';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import UserDialog from './UserDialog'; //For edit

const UserItem = ({ user, onUpdate, onDelete }) => {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false); //for edit

    const { user: loggedInUser } = useContext(AuthContext);

    const handleDelete = async () => {
        try{
            await userService.deleteUser(user.id)
            onDelete(user.id) //Update UI
        } catch (error) {
            console.error("Error on delete", error)
        } finally {
             setOpenDeleteConfirm(false);
        }
    }

    const handleEdit = () => {
        setOpenEditDialog(true)
    }

    // Determine if the current user has permission to edit/delete THIS user
    const canEdit = loggedInUser.type === 'ADMIN' || (loggedInUser.type === 'EMPLOYEE' && user.type === 'RESIDENT');
    const canDelete = loggedInUser.type === 'ADMIN' || (loggedInUser.type === 'EMPLOYEE' && user.type === 'RESIDENT');

  return (
    <>
    <ListItem>
      <ListItemText
        primary={`${user.firstName} ${user.lastName}`}
        secondary={`${user.email} - ${user.type}`}
      />
      { (canEdit || canDelete) && (
        <ListItemSecondaryAction>
           {canEdit && (<IconButton edge="end" aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>)}
          {canDelete && (<IconButton edge="end" aria-label="delete" onClick={() => setOpenDeleteConfirm(true)}>
            <DeleteIcon />
          </IconButton>)}
        </ListItemSecondaryAction>
      )}
    </ListItem>
     <ConfirmDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        content={`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`}
      />
      <UserDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={user}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default UserItem;