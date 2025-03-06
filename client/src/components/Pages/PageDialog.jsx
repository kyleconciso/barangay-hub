import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import PageFields from './PageFields';
import { pageService } from '../../services/pageService';

const PageDialog = ({ open, onClose, page, onCreate, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('PAGE');
  const [dialogError, setDialogError] = useState(''); // Add error state

  useEffect(() => {
    if (page) {
      setTitle(page.title || '');
      setContent(page.content || '');
      setSlug(page.slug || '');
      setType(page.type || 'PAGE')
    } else {
      setTitle('');
      setContent('');
      setSlug('');
      setType('PAGE');
    }
  }, [page]);

  const handleSubmit = async () => {
    try {
      const pageData = { title, content, slug, type };
      if (page) {
        // Update existing page
        const response = await pageService.updatePage(page.slug, pageData);
        onUpdate(response.data);
      } else {
        // Create new page
        const response = await pageService.createPage(pageData);
         onCreate && onCreate(response.data);
      }
      onClose();
       setTitle('');
       setContent('');
       setSlug('');
       setType('PAGE');
    } catch (error) {
       setDialogError(error.response?.data?.message || 'An error occurred.');
      console.error("Page submission error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{page ? 'Edit Page' : 'Create Page'}</DialogTitle>
      <DialogContent>
        {dialogError && <Typography color="error">{dialogError}</Typography>} {/* Display error */}
        <PageFields
          title={title}
          onTitleChange={(e) => setTitle(e.target.value)}
          content={content}
          onContentChange={setContent}
          slug={slug}
          onSlugChange={(e) => setSlug(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {page ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PageDialog;