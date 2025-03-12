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
  Stack,
  Divider,
  Avatar,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { getUsers } from "../../api/users";
import { getTickets } from "../../api/tickets";
import { getArticles } from "../../api/articles";
import { getForms } from "../../api/forms";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ArticleIcon from "@mui/icons-material/Article";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LaunchIcon from "@mui/icons-material/Launch";
import DashboardIcon from "@mui/icons-material/Dashboard";

const AdminHome = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    tickets: { total: 0, open: 0, inProgress: 0, closed: 0 },
    articles: 0,
    forms: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const ticketsData = await getTickets();
        const articlesData = await getArticles();
        const formsData = await getForms();

        setCounts({
          users: usersData.length,
          tickets: {
            total: ticketsData.length,
            open: ticketsData.filter((t) => t.status === "OPEN").length,
            inProgress: ticketsData.filter((t) => t.status === "IN_PROGRESS")
              .length,
            closed: ticketsData.filter((t) => t.status === "CLOSED").length,
          },
          articles: articlesData.length,
          forms: formsData.length,
        });

        // Sort and limit recent tickets
        const sortedTickets = [...ticketsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentTickets(sortedTickets.slice(0, 5));

        // Sort and limit recent articles
        const sortedArticles = [...articlesData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentArticles(sortedArticles.slice(0, 3));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const getTicketStatusPercentage = () => {
    if (counts.tickets.total === 0)
      return { open: 0, inProgress: 0, closed: 0 };

    return {
      open: (counts.tickets.open / counts.tickets.total) * 100,
      inProgress: (counts.tickets.inProgress / counts.tickets.total) * 100,
      closed: (counts.tickets.closed / counts.tickets.total) * 100,
    };
  };

  if (loading) {
    return (
      <Container>
        <Box
          mt={10}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2} color="textSecondary">
            Loading dashboard data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Alert
            severity="error"
            variant="filled"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            }
          >
            Error loading dashboard: {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  const ticketPercentages = getTicketStatusPercentage();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          pt: 4,
          pb: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            mr: 2,
            width: 56,
            height: 56,
          }}
        >
          <DashboardIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome, {user?.displayName || user?.email}!
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Users"
            count={counts.users}
            icon={<PeopleIcon />}
            link="/admin/users"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Tickets"
            count={counts.tickets.total}
            icon={<ConfirmationNumberIcon />}
            link="/admin/tickets"
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Articles"
            count={counts.articles}
            icon={<ArticleIcon />}
            link="/admin/articles"
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Forms"
            count={counts.forms}
            icon={<DynamicFormIcon />}
            link="/admin/forms"
            color={theme.palette.success.main}
          />
        </Grid>

        {/* Ticket Status Breakdown */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Ticket Status Breakdown
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Open
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {counts.tickets.open} tickets
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={ticketPercentages.open}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: theme.palette.error.light,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.error.main,
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      In Progress
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {counts.tickets.inProgress} tickets
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={ticketPercentages.inProgress}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: theme.palette.warning.light,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.warning.main,
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Closed
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {counts.tickets.closed} tickets
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={ticketPercentages.closed}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: theme.palette.success.light,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.success.main,
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Tickets */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Recent Tickets
            </Typography>

            {recentTickets.length > 0 ? (
              <Box sx={{ flex: 1 }}>
                {recentTickets.map((ticket, index) => (
                  <React.Fragment key={ticket.id}>
                    <Box sx={{ py: 1.5 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          component={RouterLink}
                          to={`/tickets/${ticket.id}/messages`}
                          sx={{
                            textDecoration: "none",
                            color: "text.primary",
                            fontWeight: "medium",
                            "&:hover": {
                              color: "primary.main",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {ticket.title}
                        </Typography>
                        <Chip
                          label={ticket.status.replace("_", " ")}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(ticket.status),
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(ticket.createdAt)}
                      </Typography>
                    </Box>
                    {index < recentTickets.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                No recent tickets.
              </Typography>
            )}

            <Box sx={{ mt: "auto", pt: 2 }}>
              <Button
                component={RouterLink}
                to="/admin/tickets"
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

        {/* Recent Articles */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Recent Articles
            </Typography>

            {recentArticles.length > 0 ? (
              <Box sx={{ flex: 1 }}>
                {recentArticles.map((article, index) => (
                  <React.Fragment key={article.id}>
                    <Box sx={{ py: 1.5 }}>
                      <Typography
                        component={RouterLink}
                        to={`/articles/${article.id}`}
                        sx={{
                          textDecoration: "none",
                          color: "text.primary",
                          fontWeight: "medium",
                          display: "block",
                          mb: 0.5,
                          "&:hover": {
                            color: "primary.main",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Published on {formatDate(article.createdAt)}
                      </Typography>
                    </Box>
                    {index < recentArticles.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                No recent articles.
              </Typography>
            )}

            <Box sx={{ mt: "auto", pt: 2 }}>
              <Button
                component={RouterLink}
                to="/admin/articles"
                endIcon={<LaunchIcon />}
                color="primary"
                variant="outlined"
                fullWidth
              >
                View All Articles
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Action Buttons */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              mb={3}
              fontWeight="medium"
              align="center"
            >
              Quick Actions
            </Typography>

            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <Button
                component={RouterLink}
                to="/admin/articles/create"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                Create Article
              </Button>
              <Button
                component={RouterLink}
                to="/admin/forms/create"
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                Create Form
              </Button>
              <Button
                component={RouterLink}
                to="/admin/pages/create"
                variant="contained"
                color="info"
                startIcon={<AddIcon />}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                Create Page
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Helper component for summary cards
const SummaryCard = ({ title, count, icon, link, color }) => (
  <Card
    elevation={3}
    component={RouterLink}
    to={link}
    sx={{
      textDecoration: "none",
      borderRadius: 2,
      overflow: "hidden",
      position: "relative",
      "&:hover": {
        boxShadow: (theme) => theme.shadows[10],
        transform: "translateY(-4px)",
      },
      transition: "transform 0.3s, box-shadow 0.3s",
    }}
  >
    <Box
      sx={{
        height: "7px",
        width: "100%",
        backgroundColor: color,
      }}
    />
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h3" fontWeight="bold">
            {count}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
            {title}
          </Typography>
        </Box>
        <Avatar
          sx={{
            backgroundColor: `${color}22`,
            color: color,
            width: 60,
            height: 60,
          }}
        >
          {React.cloneElement(icon, { fontSize: "large" })}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default AdminHome;
