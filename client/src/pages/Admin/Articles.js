import React from 'react';
import ManagementPage from '../../components/Management/ManagementPage';
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../../api/articles';

const AdminArticles = () => {

  const columns = [
    { field: 'title', headerName: 'Title' },
    { field: 'slug', headerName: 'Slug' },
    { field: 'createdAt', headerName: 'Created At' },
  ];

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'slug', label: 'Slug', type: 'text' },
    { name: 'content', label: 'Content', type: 'richtext' },
  ];

  return (
    <ManagementPage
      title="Article"
      columns={columns}
      fields={fields}
      fetchItems={getArticles}
      getItem={getArticle}
      createItem={createArticle}
      updateItem={updateArticle}
      deleteItem={deleteArticle}
    />
  );
};

export default AdminArticles;