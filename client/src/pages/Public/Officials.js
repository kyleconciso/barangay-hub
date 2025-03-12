import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  Divider,
  Avatar,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { getOfficials } from "../../api/users";
import { Link as RouterLink } from "react-router-dom";
import Banner from "../../components/UI/Banner";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";

const Officials = () => {
  const theme = useTheme();
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfficialsData = async () => {
      setLoading(true);
      try {
        const data = await getOfficials();
        setOfficials(data);
      } catch (err) {
        setError(err.message || "Failed to fetch officials.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficialsData();
  }, []);

  const sortOfficials = (officialsList) => {
    const roleOrder = {
      CAPTAIN: 1,
      SECRETARY: 2,
      TREASURER: 3,
      COUNCILOR: 4,
      SK_CHAIRPERSON: 5,
      SK_MEMBER: 6,
    };

    return [...officialsList].sort((a, b) => {
      const roleA = roleOrder[a.role] || Infinity;
      const roleB = roleOrder[b.role] || Infinity;
      return roleA - roleB;
    });
  };

  const sortedOfficials = sortOfficials(officials);

  const barangayCaptain = sortedOfficials.filter((o) => o.role === "CAPTAIN");

  const regularOfficials = sortedOfficials.filter(
    (o) =>
      o.role === "SECRETARY" || o.role === "TREASURER" || o.role === "COUNCILOR"
  );

  const skOfficials = sortedOfficials.filter(
    (o) => o.role === "SK_CHAIRPERSON" || o.role === "SK_MEMBER"
  );

  console.log("Captain:", barangayCaptain);
  console.log("Regular officials:", regularOfficials);
  console.log("SK officials:", skOfficials);

  const formatRole = (role) => {
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" variant="filled" sx={{ py: 2, boxShadow: 3 }}>
          Error loading officials: {error}
        </Alert>
      </Container>
    );
  }

  const bannerURL = "https://i.ibb.co/M5jVQyW/gov-forms-banner.jpg";
  const nameColor = "#f8f9fa";

  return (
    <Box sx={{ pb: 8, backgroundColor: theme.palette.background.default }}>
      <Banner
        imageUrl={bannerURL}
        title="Barangay Officials"
        subtitle="Meet the dedicated leaders serving our community"
      />

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Featured Officials (Captain) */}
        {barangayCaptain.map((captain) => (
          <Paper
            elevation={3}
            sx={{
              mb: 6,
              overflow: "hidden",
              borderRadius: 3,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
            key={captain.id}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Avatar
                  alt={`${captain.firstName} ${captain.lastName}`}
                  src={captain.imageURL}
                  sx={{
                    width: 160,
                    height: 160,
                    border: `4px solid ${theme.palette.background.paper}`,
                    mb: 2,
                    boxShadow: 3,
                  }}
                >
                  {!captain.imageURL && (
                    <AccountCircleIcon sx={{ fontSize: 100 }} />
                  )}
                </Avatar>

                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: nameColor }}
                >
                  {captain.firstName} {captain.lastName}
                </Typography>

                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    py: 0.5,
                    px: 2,
                    borderRadius: 5,
                    fontWeight: "medium",
                  }}
                >
                  Barangay Captain
                </Typography>
              </Grid>

              <Grid item xs={12} md={8} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  About the Captain
                </Typography>
                <Typography variant="body1" paragraph>
                  {captain.bio ||
                    "Our Barangay Captain leads with dedication and commitment to community service. Through innovative initiatives and responsive governance, the Captain works to improve the quality of life for all residents."}
                </Typography>

                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Office Hours
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTimeIcon
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body1">
                    Monday - Friday, 9:00 AM - 12:00 PM
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    mt: 2,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: "medium",
                  }}
                >
                  Contact the Captain
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Section title for regular officials */}
        {regularOfficials.length > 0 && (
          <Box sx={{ mb: 4, mt: 6, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                position: "relative",
                fontWeight: "bold",
                "&:after": {
                  content: '""',
                  display: "block",
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.palette.primary.main,
                  margin: "16px auto",
                },
              }}
            >
              Council Members
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: "700px", mx: "auto" }}
            >
              Our dedicated team of public servants working together to address
              community needs
            </Typography>
          </Box>
        )}

        {/* Regular Officials */}
        <Grid container spacing={3}>
          {regularOfficials.map((official) => (
            <Grid item xs={12} sm={6} md={4} key={official.id}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.primary.main,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt={`${official.firstName} ${official.lastName}`}
                    src={official.imageURL}
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 2,
                      border: `3px solid ${theme.palette.background.paper}`,
                    }}
                  >
                    {!official.imageURL && (
                      <AccountCircleIcon sx={{ fontSize: 60 }} />
                    )}
                  </Avatar>

                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontWeight: "bold", color: nameColor }}
                  >
                    {official.firstName} {official.lastName}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.primary.dark,
                      py: 0.5,
                      px: 2,
                      borderRadius: 5,
                      fontSize: "0.875rem",
                      mt: 1,
                    }}
                  >
                    {formatRole(official.role)}
                  </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {official.bio ||
                      `Serving the community with dedication and commitment.`}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    component={RouterLink}
                    to="/contact"
                    sx={{ borderRadius: 2 }}
                  >
                    Contact
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 4, mt: 8, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              position: "relative",
              fontWeight: "bold",
              "&:after": {
                content: '""',
                display: "block",
                width: "80px",
                height: "4px",
                backgroundColor:
                  theme.palette.secondary.main || theme.palette.primary.light,
                margin: "16px auto",
              },
            }}
          >
            Sangguniang Kabataan
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Youth leaders committed to representing and developing programs for
            our barangay youth
          </Typography>
        </Box>

        {/* SK Officials */}
        {skOfficials.length > 0 ? (
          <Grid container spacing={3}>
            {skOfficials.map((official) => (
              <Grid item xs={12} sm={6} md={4} key={official.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    backgroundColor: theme.palette.background.paper,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor:
                        theme.palette.secondary.main ||
                        theme.palette.primary.light,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={`${official.firstName} ${official.lastName}`}
                      src={official.imageURL}
                      sx={{
                        width: 100,
                        height: 100,
                        mb: 2,
                        border: `3px solid ${theme.palette.background.paper}`,
                      }}
                    >
                      {!official.imageURL && (
                        <AccountCircleIcon sx={{ fontSize: 60 }} />
                      )}
                    </Avatar>

                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ fontWeight: "bold", color: nameColor }}
                    >
                      {official.firstName} {official.lastName}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        color:
                          theme.palette.secondary.dark ||
                          theme.palette.primary.dark,
                        py: 0.5,
                        px: 2,
                        borderRadius: 5,
                        fontSize: "0.875rem",
                        mt: 1,
                      }}
                    >
                      {formatRole(official.role)}
                    </Typography>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {official.bio ||
                        `Representing the youth of our barangay with enthusiasm and fresh perspectives.`}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      component={RouterLink}
                      to="/contact"
                      sx={{ borderRadius: 2 }}
                    >
                      Contact
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // If no SK officials are found, show placeholder
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                maxWidth: "600px",
                mx: "auto",
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Sangguniang Kabataan officials will be displayed here once they
                are appointed or elected.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                component={RouterLink}
                to="/contact"
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Contact Barangay Hall for Information
              </Button>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Officials;
