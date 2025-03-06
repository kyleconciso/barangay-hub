import React from 'react';
import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Modal({ open, onClose, title, children, onConfirm, confirmText = "Confirm", showConfirm = true }) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box id="modal-modal-description" sx={{ mt: 2 }}>
          {children}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          {showConfirm && (<Button variant="contained" onClick={onConfirm}>
            {confirmText}
          </Button>)}
        </Box>
      </Box>
    </MuiModal>
  );
}

export default Modal;