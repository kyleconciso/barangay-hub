import React from "react";
import NavBar from "./NavBar";
import NavButton from "./NavButton";
import { useAuth } from "../../hooks/useAuth";
import { Button, Box, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { Link as RouterLink } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article"; // for news & Updates
import DynamicFormIcon from "@mui/icons-material/DynamicForm"; // for make a request
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount"; // for officials
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"; // for submit a ticket

const PublicNav = () => {
  const { user, userType } = useAuth();

  const submitTicketLink = user
    ? userType === "RESIDENT"
      ? "/user/tickets"
      : "/admin/tickets"
    : "/login";

  return (
    <NavBar contactButton={<NavBarContactButton />}>
      <NavButton to="/articles" icon={<ArticleIcon />}>
        NEWS & UPDATES
      </NavButton>
      <NavButton to="/forms" icon={<DynamicFormIcon />}>
        FORMS
      </NavButton>
      <NavButton to="/officials" icon={<SupervisorAccountIcon />}>
        OFFICIALS
      </NavButton>
      <NavButton to={submitTicketLink} icon={<ConfirmationNumberIcon />}>
        SUBMIT A TICKET
      </NavButton>
    </NavBar>
  );
};

const NavBarContactButton = () => {
  //No change needed
  return (
    <Box ml="auto">
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/contact"
        sx={{
          borderRadius: "24px",
          backgroundColor: "white",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "grey.200",
          },
          textTransform: "none",
          padding: "6px 16px",
        }}
      >
        <CallIcon sx={{ mr: 1 }} />
        <Typography variant="body1" sx={{ fontWeight: 200 }}>
          Contact Us
        </Typography>
      </Button>
    </Box>
  );
};

export default PublicNav;
