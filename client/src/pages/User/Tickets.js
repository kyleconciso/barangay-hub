import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getTickets, deleteTicket } from "../../api/tickets";
import { useAuth } from "../../hooks/useAuth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../components/UI/ConfirmDialog"; // Import ConfirmDialog

const UserTickets = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    if (typeof timestamp === "object" && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchUserTickets = async () => {
      setLoading(true);
      try {
        const allTickets = await getTickets();
        const userTickets = allTickets.filter(
          (ticket) => ticket.createdBy === user.uid
        );
        setTickets(userTickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, [user]);

  const handleDeleteClick = (ticketId) => {
    setTicketToDelete(ticketId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true); // Set loading state for deletion
    try {
      await deleteTicket(ticketToDelete);
      // Refetch tickets after successful deletion
      const allTickets = await getTickets();
      const userTickets = allTickets.filter(
        (ticket) => ticket.createdBy === user.uid
      );
      setTickets(userTickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setDeleting(false);
      setTicketToDelete(null); // Clear ticket to delete
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTicketToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return theme.palette.error.main;
      case "IN_PROGRESS":
        return theme.palette.warning.main;
      case "CLOSED":
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading tickets: {error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Tickets
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {ticket.title}
                </TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      color: getStatusColor(ticket.status),
                      fontWeight: "bold",
                      fontSize: ".9rem",
                      textTransform: "uppercase", //optional
                    }}
                  >
                    {ticket.status.replace("_", " ")}
                  </Box>
                </TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    component={RouterLink}
                    to={`/tickets/${ticket.id}/messages`}
                    aria-label="view messages"
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteClick(ticket.id)}
                    disabled={deleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {tickets.length === 0 && (
        <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
          You have not submitted any tickets yet.
        </Typography>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        loading={deleting}
      />
      <Box mt={2} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/user/tickets/create"
        >
          Submit New Ticket
        </Button>
      </Box>
    </Box>
  );
};

export default UserTickets;
