// File: src/pages/Public/Forms.js
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getForms } from "../../api/forms";
import Banner from "../../components/UI/Banner";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Skeleton,
  Button,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const FormsPublic = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const formsPerPage = 10;

  useEffect(() => {
    const fetchFormsData = async () => {
      try {
        const data = await getForms();
        setForms(data);
        setFilteredForms(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormsData();
  }, []);

  useEffect(() => {
    let results = [...forms];
    if (searchTerm) {
      results = results.filter(
        (form) =>
          form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredForms(results);
    setPage(1);
  }, [forms, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedForms = filteredForms.slice(
    (page - 1) * formsPerPage,
    page * formsPerPage
  );

  const pageCount = Math.ceil(filteredForms.length / formsPerPage);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box mt={4} mb={4}>
          <Skeleton variant="text" height={60} width="40%" />
          <Skeleton variant="rectangular" height={60} sx={{ my: 3 }} />
          <List>
            {[1, 2, 3, 4, 5].map((item) => (
              <ListItem key={item} alignItems="flex-start" sx={{ py: 1 }}>
                <ListItemIcon>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" height={20} width="80%" />}
                  secondary={
                    <Skeleton variant="text" height={20} width="60%" />
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box mt={4} mb={4} textAlign="center">
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Forms
          </Typography>
          <Typography>{error.message}</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  const bannerURL = "https://i.ibb.co/M5jVQyW/gov-forms-banner.jpg";

  return (
    <Box sx={{ py: 0, minHeight: "100vh" }}>
      {" "}
      {/* reduced py to 0 */}
      <Banner imageUrl={bannerURL} title="Forms & Downloads" />{" "}
      {/* banner component */}
      <Container maxWidth="md" sx={{ mt: 2 }}>
        {" "}
        {/* adjusted mt */}
        {/* search section - compact */}
        <Box sx={{ mb: 3 }}>
          {" "}
          <TextField
            fullWidth
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: "50px", height: "40px" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
              },
            }}
          />
        </Box>
        {/* filter results summary */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          <Typography variant="body2" color="textSecondary">
            {" "}
            {filteredForms.length === 0
              ? "No forms found"
              : `Showing ${filteredForms.length} forms`}
          </Typography>
        </Box>
        {/* forms list */}
        <List
          sx={{
            bgcolor: "background.paper",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {" "}
          {filteredForms.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom>
                No forms found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria.
              </Typography>
            </Paper>
          ) : (
            paginatedForms.map((form, index) => (
              <Paper
                key={form.id}
                elevation={0}
                sx={{
                  borderBottom:
                    index < paginatedForms.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                {" "}
                {/* divider between list items */}
                <ListItem
                  component={RouterLink}
                  to={form.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  disablePadding
                >
                  <ListItemButton
                    sx={{ p: 2, display: "flex", alignItems: "center" }}
                  >
                    {" "}
                    {/* align items vertically in button */}
                    <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                      {" "}
                      {/* reduce icon spacing */}
                      {form.logoURL ? (
                        <Box
                          component="img"
                          src={form.logoURL}
                          alt={`${form.title} Logo`}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "8px",
                            mr: 1,
                          }}
                        />
                      ) : (
                        <DescriptionIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {form.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                        >
                          {form.description}
                        </Typography>
                      }
                      sx={{ flexGrow: 1, minWidth: 0 }}
                    />
                    <ArrowForwardIcon color="action" />
                  </ListItemButton>
                </ListItem>
              </Paper>
            ))
          )}
        </List>
        {/* pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            {" "}
            {/* reduced mt */}
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FormsPublic;
