import React, {useState} from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from './FormDialog'; 
import { formService } from '../../services/formService';
import ConfirmDialog from '../UI/ConfirmDialog';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';


const FormItem = ({ form, onUpdate, onDelete }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

      const { user } = useContext(AuthContext);

    const handleEdit = () => {
        setOpenEditDialog(true);
    };

     const handleDelete = async () => {
        try{
            await formService.deleteForm(form.id)
            onDelete(form.id)
        } catch(error) {
            console.error("Error on delete", error)
        } finally {
            setOpenDeleteConfirm(false);
        }

    }

    const isEditable = user && (user.type === 'ADMIN' || user.type === 'EMPLOYEE')

  return (
    <>
    <ListItem>
      <ListItemText
        primary={<Link href={form.link} target="_blank" rel="noopener noreferrer">{form.title}</Link>}
        secondary={form.description}
      />
       {isEditable && (
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={() => setOpenDeleteConfirm(true)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
      )}
    </ListItem>
     <FormDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        form={form}
        onUpdate={onUpdate}
      />
       <ConfirmDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        content={`Are you sure you want to delete the form "${form.title}"?`}
        />
    </>
  );
};

export default FormItem;