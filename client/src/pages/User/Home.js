import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { getTickets } from "../../api/tickets"; // Import getTickets API
import { useAuth } from "../../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LaunchIcon from "@mui/icons-material/Launch";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UserHome = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCounts, setTicketCounts] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allTickets = await getTickets(); // Fetch all tickets
        const userTickets = allTickets.filter(
          (ticket) => ticket.createdBy === user.uid // Filter for user's tickets
        );

        setTicketCounts({
          total: userTickets.length,
          open: userTickets.filter((t) => t.status === "OPEN").length,
          inProgress: userTickets.filter((t) => t.status === "IN_PROGRESS")
            .length,
          closed: userTickets.filter((t) => t.status === "CLOSED").length,
        });

        // Sort and limit recent tickets
        const sortedTickets = [...userTickets].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentTickets(sortedTickets.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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

  if (loading) {
    return (
      <Container>
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error loading user dashboard: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          User Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Welcome, {user?.displayName || user?.email}! Here's an overview of
          your account.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Ticket Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Tickets"
            count={ticketCounts.total}
            icon={<ConfirmationNumberIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Open Tickets"
            count={ticketCounts.open}
            icon={<ReportProblemIcon />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Tickets In Progress"
            count={ticketCounts.inProgress}
            icon={<HourglassEmptyIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Closed Tickets"
            count={ticketCounts.closed}
            icon={<CheckCircleOutlineIcon />}
            color={theme.palette.success.main}
          />
        </Grid>

        {/* Recent Tickets List */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Recent Tickets
            </Typography>
            {recentTickets.length > 0 ? (
              <List sx={{ flex: "1 0 auto" }}>
                {" "}
                {/* Make list take up available space */}
                {recentTickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <ListItem
                      button
                      component={RouterLink}
                      to={`/tickets/${ticket.id}/messages`}
                    >
                      <ListItemText
                        primary={ticket.title}
                        secondary={`Status: ${ticket.status.replace(
                          "_",
                          " "
                        )} - Created: ${formatDate(ticket.createdAt)}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="view"
                          component={RouterLink}
                          to={`/tickets/${ticket.id}/messages`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                No recent tickets submitted.
              </Typography>
            )}
            <Box mt="auto" pt={2}>
              {" "}
              {/* Push "View All Tickets" to the bottom */}
              <Button
                component={RouterLink}
                to="/user/tickets"
                endIcon={<LaunchIcon />}
                color="primary"
                variant="outlined"
                fullWidth
              >
                View All Tickets
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Quick Actions
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: "1 0 auto",
              }}
            >
              {" "}
              {/* Make buttons take available space */}
              <Button
                component={RouterLink}
                to="/user/tickets/create" // Assuming you have a create ticket route
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                sx={{ flexGrow: 1, justifyContent: "flex-start" }}
              >
                Submit a Ticket
              </Button>
              <Button
                component={RouterLink}
                to="/forms"
                variant="contained"
                color="secondary"
                startIcon={<DescriptionIcon />}
                sx={{ flexGrow: 1, justifyContent: "flex-start" }}
              >
                View Forms
              </Button>
              <Button
                component={RouterLink}
                to="/articles"
                variant="contained"
                color="info"
                startIcon={<ArticleIcon />}
                sx={{ flexGrow: 1, justifyContent: "flex-start" }}
              >
                News & Updates
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const SummaryCard = ({ title, count, icon, color }) => (
  <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
    <Box sx={{ height: "7px", width: "100%", backgroundColor: color }} />
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {count}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Avatar
          sx={{ bgcolor: `${color}22`, color: color, width: 56, height: 56 }}
        >
          {React.cloneElement(icon, { fontSize: "large" })}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const ReportProblemIcon = React.forwardRef((props, ref) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
    ref={ref}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1-2.1-.94-2.1-2.1.94-2.1 2.1-2.1m0 13c-4 0-6 2-6 2h12s-2-2-6-2m0-8c-2.67 0-8 1.34-8 4v4h16v-4c0-2.66-5.33-4-8-4" />
  </svg>
));

const HourglassEmptyIcon = React.forwardRef((props, ref) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
    ref={ref}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 7V3.1C6 2 6.9 1 8 1h8c1.1 0 2 .9 2 2.1V7h2c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h2zm10-2H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1z" />
  </svg>
));

const CheckCircleOutlineIcon = React.forwardRef((props, ref) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
    ref={ref}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
));

export default UserHome;
