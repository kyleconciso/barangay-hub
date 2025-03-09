
import React from 'react';
import NavBar from './NavBar';
import NavButton from './NavButton';
import { useAuth } from '../../hooks/useAuth';
import DescriptionIcon from '@mui/icons-material/Description'; // for pages
import ArticleIcon from '@mui/icons-material/Article';       // for articles
import DynamicFormIcon from '@mui/icons-material/DynamicForm'; // for forms
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // for tickets
import PeopleIcon from '@mui/icons-material/People';          // for users
import SettingsIcon from '@mui/icons-material/Settings';      // for settings

const AdminNav = () => {
  const { userType } = useAuth();

  return (
    <NavBar>
      <NavButton to="/admin/pages" icon={<DescriptionIcon />} >Pages</NavButton>
      <NavButton to="/admin/articles" icon={<ArticleIcon />} >Articles</NavButton>
      <NavButton to="/admin/forms" icon={<DynamicFormIcon />} >Forms</NavButton>
      <NavButton to="/admin/tickets" icon={<ConfirmationNumberIcon />} >Tickets</NavButton>
      <NavButton to="/admin/users" icon={<PeopleIcon />} >Users</NavButton>
      {userType === 'ADMIN' && (
        <NavButton to="/admin/settings" icon={<SettingsIcon />} >Settings</NavButton>
      )}
    </NavBar>
  );
};

export default AdminNav;