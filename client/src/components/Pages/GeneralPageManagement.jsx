import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { getAllPages, createPage, updatePage, deletePage } from '../../services/pages.service';
import MarkdownEditor from './MarkdownEditor'; // Reuse the MarkdownEditor
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../UI/ErrorMessage';

function GeneralPageManagement() {
  const [pages, setPages] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState({ title: '', slug: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get the currentUser

  // filtering for NON-article pages
  useEffect(() => {
        const fetchPages = async () => {
            setLoading(true);
            try {
                const allPages = await getAllPages();
                const generalPages = allPages.filter(page => page.type !== 'ARTICLE'); // Filter out articles
                setPages(generalPages);
            } catch (error) {
                console.error("Failed to fetch general pages:", error);
                setError("Failed to load general pages.");
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
  }, []);

  const handleCreateOpen = () => {
    setCurrentPage({ title: '', slug: '', content: '' }); 
    setOpenCreateDialog(true);
  };
  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

    const handleEditOpen = (page) => {
        setCurrentPage(page);
        setOpenEditDialog(true);
    };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const newId = await createPage(currentPage);
      setPages(prevPages => [...prevPages, { ...currentPage, id: newId }]);
      handleCreateClose();
    } catch (error) {
        console.error("Failed to create page: ", error);
        setError("Failed to create page")
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try{
        await updatePage(currentPage.slug, currentPage);
        setPages(prevPages =>
            prevPages.map(p => (p.id === currentPage.id ? currentPage : p))
        );
        handleEditClose();
    }catch (error){
        console.error("Failed to update page: ", error);
        setError("Failed to update page")
    } finally {
        setLoading(false)
    }

  };

  const handleDelete = async (pageId, pageSlug) => {
        setLoading(true);
        try{
            await deletePage(pageSlug);
            setPages(prevPages => prevPages.filter(page => page.id !== pageId));
            setError('');
        } catch (error){
            console.error("Error deleting page:", error);
            setError("Failed to delete page");
        } finally {
            setLoading(false);
        }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        General Page Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateOpen} sx={{ mb: 2 }}>
        Create New Page
      </Button>
        {error && <ErrorMessage message={error}/>}
        {loading && <Typography>Loading...</Typography>}
      <List>
        {pages.map((page) => (
          <ListItem key={page.id} divider>
            <ListItemText primary={page.title} secondary={`Slug: ${page.slug}`} />
            <Button onClick={() => handleEditOpen(page)} disabled={loading}>Edit</Button>
            <Button onClick={() => handleDelete(page.id, page.slug)} color="error" disabled={loading}>Delete</Button>
          </ListItem>
        ))}
      </List>

      {/* Create Page Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCreateClose}>
        <DialogTitle>Create New Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
            value={currentPage.title}
            onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Slug"
            fullWidth
            variant="standard"
            value={currentPage.slug}
            onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
          />
          <MarkdownEditor
            value={currentPage.content}
            onChange={(value) => setCurrentPage({ ...currentPage, content: value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Page Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditClose}>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                variant="standard"
                value={currentPage.title}
                onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Slug"
                fullWidth
                variant="standard"
                value={currentPage.slug}
                onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
            />
            <MarkdownEditor
                value={currentPage.content}
                onChange={(value) => setCurrentPage({ ...currentPage, content: value })}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading}>Update</Button>
            </DialogActions>
        </Dialog>
    </Container>
  );
}

export default GeneralPageManagement;