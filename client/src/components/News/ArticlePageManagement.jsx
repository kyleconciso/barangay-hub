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
import MarkdownEditor from '../Pages/MarkdownEditor';
import { useAuth } from '../../context/AuthContext';     
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../UI/ErrorMessage';

function ArticlePageManagement() {
  const [articles, setArticles] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState({ title: '', slug: '', content: '', type: 'ARTICLE' }); //Default type.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { currentUser } = useAuth(); // 

  // Fetch articles on component mount
  useEffect(() => {
        const fetchArticles = async () => {
        setLoading(true);
        try {
            const allPages = await getAllPages();
            const filteredArticles = allPages.filter(page => page.type === 'ARTICLE');
            setArticles(filteredArticles);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
            setError('Failed to load articles.');
        } finally {
            setLoading(false);
        }
    };

    fetchArticles();

  }, []);


  const handleCreateOpen = () => {
    setCurrentArticle({ title: '', slug: '', content: '', type: 'ARTICLE'  });
    setOpenCreateDialog(true);
  };
  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

  const handleEditOpen = (article) => {
    setCurrentArticle(article);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };



  const handleCreate = async () => {
        setLoading(true);
        try {
            const newId = await createPage(currentArticle);
            setArticles(prevArticles => [...prevArticles, { ...currentArticle, id: newId }]);
            handleCreateClose();
            setError('');
        } catch (error) {
            console.error("Error creating article:", error);
            setError("Failed to create article");
        } finally {
            setLoading(false);
        }
    };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updatePage(currentArticle.slug, currentArticle);
      setArticles(prevArticles =>
        prevArticles.map(a => (a.id === currentArticle.id ? currentArticle : a))
      );
      handleEditClose();
    } catch (err) {
      console.error('Error updating article', err);
      setError("Failed to update article");

    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (articleId, articleSlug) => {
    setLoading(true)
    try{
        await deletePage(articleSlug);
        setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
        setError('');
    } catch (error){
        console.error("Error deleting article:", error);
        setError("Failed to delete article");
    } finally {
        setLoading(false);
    }
  };



 return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Article Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateOpen} sx={{ mb: 2 }}>
        Create New Article
      </Button>
      {error && <ErrorMessage message={error}/>}
      {loading && <Typography>Loading...</Typography>}
      <List>
        {articles.map((article) => (
          <ListItem key={article.id} divider>
            <ListItemText primary={article.title} secondary={`Slug: ${article.slug}`} />
            <Button onClick={() => handleEditOpen(article)} disabled={loading}>Edit</Button>
            <Button onClick={() => handleDelete(article.id, article.slug)} color="error" disabled={loading}>Delete</Button>
          </ListItem>
        ))}
      </List>

      {/* Create Article Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCreateClose}>
        <DialogTitle>Create New Article</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
            value={currentArticle.title}
            onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Slug"
            fullWidth
            variant="standard"
            value={currentArticle.slug}
            onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
          />
          <MarkdownEditor
            value={currentArticle.content}
            onChange={(value) => setCurrentArticle({ ...currentArticle, content: value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>Create</Button>
        </DialogActions>
      </Dialog>

    {/* Edit Article Dialog */}
    <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Article</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
            value={currentArticle.title}
            onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Slug"
            fullWidth
            variant="standard"
            value={currentArticle.slug}
            onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
          />
          <MarkdownEditor
            value={currentArticle.content}
            onChange={(value) => setCurrentArticle({ ...currentArticle, content: value })}
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

export default ArticlePageManagement;