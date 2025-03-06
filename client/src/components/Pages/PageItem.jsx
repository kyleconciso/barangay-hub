// src/components/Pages/PageItem.jsx
import React, {useState} from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import PageDialog from './PageDialog';
import ConfirmDialog from '../UI/ConfirmDialog';
import { pageService } from '../../services/pageService';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const PageItem = ({ page, onUpdate, onDelete }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const sanitizedContent = DOMPurify.sanitize(page.content);

     const { user } = useContext(AuthContext);

    const handleEdit = () => {
        setOpenEditDialog(true);
    }
    const handleDelete = async() => {
        try {
            await pageService.deletePage(page.slug);
            onDelete(page.slug);
          } catch (error) {
            console.error('Error deleting page', error)
          } finally {
            setOpenDeleteConfirm(false)
          }
    }

     const isEditable = user && (user.type === 'ADMIN' || user.type === 'EMPLOYEE')

  return (
    <>
    <Card sx={{marginBottom: 2}}>
      <CardContent>
        <Typography variant="h5">{page.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {page.slug} {/* Display slug */}
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

      </CardContent>
      {isEditable && (
      <CardActions>
        <Button size="small" onClick={handleEdit}>Edit</Button>
        <Button size="small" onClick={() => setOpenDeleteConfirm(true)}>Delete</Button>
      </CardActions>)}
    </Card>

    <PageDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        page={page}
        onUpdate={onUpdate}
      />
    <ConfirmDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        content={`Are you sure you want to delete the page "${page.title}"?`}
        />
    </>
  );
};

export default PageItem;