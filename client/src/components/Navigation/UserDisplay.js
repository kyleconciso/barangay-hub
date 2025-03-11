// src/components/Navigation/UserDisplay.js
import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Tooltip,
  Paper,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../../hooks/useAuth";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const UserDisplay = () => {
  const { user, userType, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDashboardClick = () => {
    if (userType === "ADMIN" || userType === "EMPLOYEE") {
      navigate("/admin");
    } else if (userType === "RESIDENT") {
      navigate("/user");
    }
    handleMenuClose();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // generate a consistent color based on user name or email
  const generateAvatarColor = (name) => {
    if (!name) return theme.palette.primary.main;

    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
    ];

    // simple hash function to get a consistent color
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const avatarColor = user
    ? generateAvatarColor(user.displayName || user.email)
    : theme.palette.primary.main;

  const userTypeLabel = () => {
    if (!userType) return "";

    const labels = {
      ADMIN: "Admin",
      EMPLOYEE: "Employee",
      RESIDENT: "Resident",
    };

    return labels[userType] || userType;
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
      {user && (
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            alignItems: "flex-end",
            mr: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.2,
              mb: 0.25,
              color: "white",
            }}
          >
            Welcome,{" "}
            <span style={{ fontWeight: 600 }}>
              {user.displayName || user.email.split("@")[0]}
            </span>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontSize: "0.6rem",
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            {userTypeLabel()}
          </Typography>
        </Box>
      )}

      <Tooltip title={user ? "Account menu" : "Login"}>
        <IconButton
          size="medium"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          sx={{
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          {user ? (
            <Avatar
              sx={{
                bgcolor: avatarColor,
                width: 38,
                height: 38,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {getInitials(user.displayName || user.email)}
            </Avatar>
          ) : (
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main, // Primary color for the background
                color: theme.palette.grey[200], // Grey color for the icon
              }}
            >
              <AccountCircle />
            </Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {user ? (
          <>
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mb: 1.5,
                  bgcolor: avatarColor,
                  fontWeight: 600,
                }}
              >
                {getInitials(user.displayName || user.email)}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.displayName || user.email.split("@")[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleDashboardClick} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="My Dashboard" />
            </MenuItem>

            {userType === "ADMIN" && (
              <MenuItem
                component={RouterLink}
                to="/admin/settings"
                onClick={handleMenuClose}
                sx={{ py: 1.5, px: 2 }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
            )}

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "error" }}
              />
            </MenuItem>
          </>
        ) : (
          <MenuItem
            component={RouterLink}
            to="/login"
            onClick={handleMenuClose}
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemIcon>
              <LoginIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default UserDisplay;
