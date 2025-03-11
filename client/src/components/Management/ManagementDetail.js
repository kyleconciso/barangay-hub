import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  Paper,
  Link, // Import Link component
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import parse from 'html-react-parser';

// helper function to format date objects or firestore timestamps
const formatTimestamp = (value) => {
  // handle firestore timestamp objects (with _seconds and _nanoseconds)
  if (value && typeof value === 'object' && '_seconds' in value) {
    // convert to javascript date
    return new Date(value._seconds * 1000).toLocaleString();
  }

  // handle date objects
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  // return the value as is if it's already a string or other primitive
  return value;
};

const ManagementDetail = ({
  title,
  fields,
  open,
  item,
  onClose,
  onEditClick,
}) => {
  if (!item) return null;

  const renderFieldValue = (field, value) => {
    if (value === null || value === undefined) {
      return <Typography variant="body2" color="text.secondary">Not provided</Typography>;
    }

    // handle timestamp objects
    if (typeof value === 'object' && '_seconds' in value) {
      value = formatTimestamp(value);
    }

    switch (field.type) {
      case 'richtext':
        return <Box sx={{ mt: 1 }}>{parse(String(value))}</Box>;

      case 'select':
        const option = field.options?.find(opt => opt.value === value);
        return <Typography variant="body1">{option ? option.label : String(value)}</Typography>;

      case 'date':
      case 'datetime':
        return <Typography variant="body1">{formatTimestamp(value)}</Typography>;

      case 'uri': // Handle URI type for image URLs and links
        return (
          <Link href={value} target="_blank" rel="noopener noreferrer">
            <Typography variant="body1">{String(value)}</Typography>
          </Link>
        );

      default:
        return <Typography variant="body1">{String(value)}</Typography>;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            {title} Details
          </Grid>
          <Grid item>
            <Button
              startIcon={<EditIcon />}
              onClick={onEditClick}
              color="primary"
              variant="outlined"
              size="small"
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} key={field.name}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {field.label}
                </Typography>
                <Divider sx={{ my: 1 }} />
                {renderFieldValue(field, item[field.name])}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagementDetail;