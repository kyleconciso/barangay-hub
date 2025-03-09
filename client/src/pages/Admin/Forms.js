import React from 'react';
import ManagementPage from '../../components/Management/ManagementPage';
import { getForms, getForm, createForm, updateForm, deleteForm } from '../../api/forms';

const AdminForms = () => {

  const columns = [
    { field: 'title', headerName: 'Title' },
    { field: 'link', headerName: 'Link' },
  ];

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'link', label: 'Link', type: 'uri' },
    { name: 'logoURL', label: 'Logo URL', type: 'uri' },
  ];

  return (
    <ManagementPage
      title="Form"
      columns={columns}
      fields={fields}
      fetchItems={getForms}
      getItem={getForm}
      createItem={createForm}
      updateItem={updateForm}
      deleteItem={deleteForm}
    />
  );
};

export default AdminForms;