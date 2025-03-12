import React from "react";
import NavBar from "./NavBar";
import NavButton from "./NavButton";
import { useAuth } from "../../hooks/useAuth";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

const AdminNav = () => {
  const { userType } = useAuth();

  return (
    <NavBar>
      <NavButton to="/admin" icon={<DashboardIcon />}>
        DASHBOARD
      </NavButton>
      <NavButton to="/admin/pages" icon={<DescriptionIcon />}>
        PAGES
      </NavButton>
      <NavButton to="/admin/articles" icon={<ArticleIcon />}>
        ARTICLES
      </NavButton>
      <NavButton to="/admin/forms" icon={<DynamicFormIcon />}>
        FORMS
      </NavButton>
      <NavButton to="/admin/tickets" icon={<ConfirmationNumberIcon />}>
        TICKETS
      </NavButton>
      <NavButton to="/admin/users" icon={<PeopleIcon />}>
        USERS
      </NavButton>
      {userType === "ADMIN" && (
        <NavButton to="/admin/settings" icon={<SettingsIcon />}>
          SETTINGS
        </NavButton>
      )}
    </NavBar>
  );
};

export default AdminNav;
