import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../hooks/useAuth";

const UserProfile = () => {
  const { user, userType } = useAuth();

  if (!user) {
    return <Typography>Loading profile...</Typography>;
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3} sx={{ textAlign: "center" }}>
              {/* Display user's profile picture if available */}
              {user.photoURL ? (
                <Avatar
                  src={user.photoURL}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    mx: "auto",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: 48,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  {getInitials(user.displayName || user.email)}
                </Avatar>
              )}
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mt: 1 }}
              >
                Edit Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <Typography variant="h4" gutterBottom>
                {user.displayName || "User Profile"}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="textSecondary">
                    User Type:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1">{userType}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Address:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1">
                    {user.address || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Phone:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1">{user.phone || "N/A"}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserProfile;
