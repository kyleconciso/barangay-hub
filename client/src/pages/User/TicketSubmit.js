import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { createTicket } from "../../api/tickets";
import { useNavigate } from "react-router-dom";

const TicketSubmit = () => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!title.trim()) {
      setError("Title is required.");
      setLoading(false);
      return;
    }

    try {
      const ticketData = {
        title: title,
        description: description,
      };
      await createTicket(ticketData);
      setSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Submit a Ticket
        </Typography>
        <Typography color="textSecondary" align="center" paragraph>
          Please fill out the form below to submit a new ticket. We will get
          back to you as soon as possible.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                label="Title"
                placeholder="Briefly describe your issue"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="description"
                label="Description"
                placeholder="Provide more details about your issue"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Ticket"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Ticket submitted successfully! We will get back to you soon.
          </Alert>
        )}
        {error && !success && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default TicketSubmit;
