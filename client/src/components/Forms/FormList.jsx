import React from 'react';
import { List } from '@mui/material';
import FormItem from './FormItem';

function FormList({ forms }) {
  return (
    <List>
      {forms.map((form) => (
        <FormItem key={form.id} form={form} />
      ))}
    </List>
  );
}

export default FormList;