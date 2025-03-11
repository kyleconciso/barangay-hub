import React from "react";
import NavBar from "./NavBar";
import NavButton from "./NavButton";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"; // for my tickets

const UserNav = () => {
  return (
    <NavBar>
      <NavButton to="/user/tickets" icon={<ConfirmationNumberIcon />}>
        My Tickets
      </NavButton>
    </NavBar>
  );
};

export default UserNav;
