import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, userType } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (userType === "RESIDENT") {
      navigate("/user");
    } else if (userType === "ADMIN" || userType === "EMPLOYEE") {
      navigate("/admin");
    }
  }, [userType, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Use minHeight instead of height
        width: "100vw",
        overflow: "hidden", // Keep overflow hidden
        display: "flex",
        background: "linear-gradient(135deg, #3f51b5 0%, #9c27b0 100%)",
      }}
    >
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <img
              src="https://i.ibb.co/Ps6D83RM/logo.png"
              alt="Brgy. San Antonio Logo"
              style={{
                height: isMobile ? "100px" : "150px",
                marginBottom: "20px",
              }}
            />
            <Typography
              variant={isMobile ? "h4" : "h3"}
              fontWeight="bold"
              sx={{
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              Barangay San Antonio
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                mt: 2,
                textAlign: "center",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Building a stronger community together
            </Typography>
          </Box>
        </Grid>
        {/* Login Form Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            backgroundColor: isMobile ? "white" : "transparent",
          }}
        >
          <Paper
            elevation={isMobile ? 0 : 10}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: "450px",
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              mb={3}
              fontWeight="medium"
              color="primary"
            >
              Welcome Back
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: 1.5,
                  py: 1.5,
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body1">
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    fontWeight: "medium",
                    "&:hover": {
                      textDecoration: "none",
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
