// src/components/Pages/PageList.jsx
import React, { useState, useEffect } from 'react';
import { pageService } from '../../services/pageService';
import PageItem from './PageItem';
import { List, Container, Typography, Button } from '@mui/material';
import PageDialog from './PageDialog';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ErrorMessage from '../UI/ErrorMessage'; // Import ErrorMessage

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false); //for create dialog

  const { user: loggedInUser, loading: authLoading } = useContext(AuthContext); // Get loading state

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await pageService.getAllPages();
        setPages(response.data.pages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handlePageCreated = (newPage) => {
    setPages(prevPages => [newPage, ...prevPages]); // Add to the *beginning* for consistent display
  };
  const handlePageUpdated = (updatedPage) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.id === updatedPage.id ? updatedPage : page))
    );
  };

  const handlePageDeleted = (deletedPageSlug) => {
    setPages(prevPages => prevPages.filter(page => page.slug !== deletedPageSlug));
  };


  if (loading || authLoading) { // Check authLoading as well
    return <div>Loading...</div>; // Or your LoadingSpinner
  }

  if (error) {
    return <ErrorMessage message={error.message} />; // Use ErrorMessage
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>Pages</Typography>
      {/* Check if loggedInUser exists before accessing its properties */}
      {loggedInUser && (loggedInUser.type === 'ADMIN' || loggedInUser.type === 'EMPLOYEE') && (
        <Button variant="contained" color="primary" onClick={() => setOpenCreateDialog(true)}>
          Add Page
        </Button>
      )}

      <PageDialog //For create
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={handlePageCreated}
      />
      <List>
        {/* Filter out null/undefined pages and pages without a type */}
        {pages.filter(page => page && page.type).map((page) => (
          <PageItem key={page.id} page={page} onUpdate={handlePageUpdated} onDelete={handlePageDeleted} />
        ))}
      </List>
    </Container>
  );
};

export default PageList;