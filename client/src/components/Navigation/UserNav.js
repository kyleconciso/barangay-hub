import React from "react";
import NavBar from "./NavBar";
import NavButton from "./NavButton";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";

const UserNav = () => {
  return (
    <NavBar>
      <NavButton to="/user" icon={<DashboardIcon />}>
        DASHBOARD
      </NavButton>
      <NavButton to="/user/tickets" icon={<ConfirmationNumberIcon />}>
        MY TICKETS
      </NavButton>
      <NavButton to="/user/tickets/create" icon={<AddCircleIcon />}>
        SUBMIT TICKET
      </NavButton>
    </NavBar>
  );
};

export default UserNav;
