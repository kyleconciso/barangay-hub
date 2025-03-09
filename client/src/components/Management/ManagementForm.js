import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// safe conversion helper to handle various object types
const safeValue = (value) => {
  // return empty string for null/undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // handle firestore timestamp objects (with _seconds and _nanoseconds)
  if (typeof value === 'object' && '_seconds' in value) {
    return new Date(value._seconds * 1000).toLocaleString();
  }
  
  // handle date objects
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  
  // handle empty objects
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return '';
  }
  
  // for other objects, convert to json string
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '';
    }
  }
  
  // otherwise return as is
  return value;
};

const ManagementForm = ({
  title,
  fields,
  open,
  mode,
  initialData,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({});
  const [richTextEditors, setRichTextEditors] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // initialize form data with initial values or empty object
      const newFormData = initialData ? { ...initialData } : {};
      
      // clean up any object values that can't be directly rendered
      fields.forEach(field => {
        if (newFormData[field.name] !== undefined) {
          // convert any object values to appropriate string representations
          if (typeof newFormData[field.name] === 'object') {
            // don't stringify richtext fields, they'll be handled separately
            if (field.type !== 'richtext') {
              newFormData[field.name] = safeValue(newFormData[field.name]);
            }
          }
        } else {
          // set default values for missing fields
          newFormData[field.name] = '';
        }
      });

      // initialize rich text editors if needed
      const newRichTextEditors = {};
      fields.forEach(field => {
        if (field.type === 'richtext') {
          let editorState;
          
          if (initialData && initialData[field.name]) {
            try {
              // handle the case where content might be an object
              const htmlContent = typeof initialData[field.name] === 'object' 
                ? '' 
                : String(initialData[field.name]);
                
              const contentBlock = htmlToDraft(htmlContent);
              if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState);
              } else {
                editorState = EditorState.createEmpty();
              }
            } catch (e) {
              console.error('Error initializing rich text editor:', e);
              editorState = EditorState.createEmpty();
            }
          } else {
            editorState = EditorState.createEmpty();
          }
          
          newRichTextEditors[field.name] = editorState;
        }
      });

      setFormData(newFormData);
      setRichTextEditors(newRichTextEditors);
      setErrors({});
    }
  }, [open, initialData, fields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // clear error for this field if any
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleRichTextChange = (name, editorState) => {
    setRichTextEditors({
      ...richTextEditors,
      [name]: editorState,
    });
    
    // convert editor content to html and store in formdata
    const contentState = editorState.getCurrentContent();
    const html = draftToHtml(convertToRaw(contentState));
    
    setFormData({
      ...formData,
      [name]: html,
    });
    
    // clear error for this field if any
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      // simple required validation - can be extended for other validation types
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // create a clean copy of form data without any problematic objects
    const cleanedFormData = { ...formData };
    
    // make sure all data is in a format that won't cause rendering issues
    Object.keys(cleanedFormData).forEach(key => {
      if (typeof cleanedFormData[key] === 'object' && !(cleanedFormData[key] instanceof Date)) {
        // for rich text fields, we want to keep the html string
        const field = fields.find(f => f.name === key);
        if (field && field.type === 'richtext') {
          // no change needed, already html string
        } else {
          // convert other objects to string representation
          cleanedFormData[key] = safeValue(cleanedFormData[key]);
        }
      }
    });

    setLoading(true);
    try {
      const success = await onSubmit(cleanedFormData);
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({
        ...errors,
        _general: "Failed to submit form. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const { name, label, type, options = [] } = field;
    // ensure value is never an object that could cause rendering issues
    const value = typeof formData[name] === 'object' ? safeValue(formData[name]) : (formData[name] || '');
    const error = errors[name] || null;

    switch (type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={label}
            name={name}
            value={value}
            onChange={handleInputChange}
            error={!!error}
            helperText={error}
            margin="normal"
            variant="outlined"
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            label={label}
            name={name}
            value={value}
            onChange={handleInputChange}
            error={!!error}
            helperText={error}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />
        );

      case 'select':
        return (
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!error}
            variant="outlined"
          >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              name={name}
              value={value || ''}
              onChange={handleInputChange}
              label={label}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'richtext':
        return (
          <Box sx={{ mt: 2, mb: 2 }}>
            <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
            <Box 
              sx={{ 
                border: error ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)', 
                borderRadius: 1,
                minHeight: 200,
                overflow: 'hidden'
              }}
            >
              <Editor
                editorState={richTextEditors[name]}
                onEditorStateChange={(editorState) => handleRichTextChange(name, editorState)}
                wrapperClassName="rich-text-wrapper"
                editorClassName="rich-text-editor"
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'history'],
                }}
              />
            </Box>
            {error && (
              <FormHelperText error>{error}</FormHelperText>
            )}
          </Box>
        );

      default:
        return (
          <TextField
            fullWidth
            label={label}
            name={name}
            value={value}
            onChange={handleInputChange}
            error={!!error}
            helperText={error}
            margin="normal"
            variant="outlined"
          />
        );
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'create' ? `Create ${title}` : `Edit ${title}`}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
          {errors._general && (
            <Grid item xs={12}>
              <Box sx={{ color: 'error.main', mt: 2 }}>
                {errors._general}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagementForm;