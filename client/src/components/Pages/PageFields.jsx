import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill's styles
import { TextField } from '@mui/material';

const PageFields = ({ title, onTitleChange, content, onContentChange, slug, onSlugChange }) => {

    const modules = { //Quill Modules
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ],
      };


  return (
    <>
        <TextField
            margin="dense"
            label="Slug"
            type="text"
            fullWidth
            value={slug}
            onChange={onSlugChange}
      />
      <TextField
        margin="dense"
        label="Title"
        type="text"
        fullWidth
        value={title}
        onChange={onTitleChange}
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onContentChange}
        modules={modules}
        style={{height: '300px'}}
      />
    </>
  );
};

export default PageFields;