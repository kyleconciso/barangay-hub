import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../hooks/useAuth";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // import usenavigate

const UserDisplay = () => {
  const { user, userType, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // use usenavigate hook

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

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {user && (
        <Typography variant="body2">
          {user.displayName || user.email} ({userType})
        </Typography>
      )}
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        {user ? (
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {getInitials(user.displayName || user.email)}
          </Avatar>
        ) : (
          <AccountCircle />
        )}
      </IconButton>
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
      >
        {user ? (
          <>
            {/* <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
              Profile
            </MenuItem> */}
            <MenuItem onClick={handleDashboardClick}>My Dashboard</MenuItem>
            {userType === "ADMIN" && (
              <MenuItem
                component={RouterLink}
                to="/admin/settings"
                onClick={handleMenuClose}
              >
                Settings
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem
            component={RouterLink}
            to="/login"
            onClick={handleMenuClose}
          >
            Login
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default UserDisplay;
