import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import EmployeeRoute from './EmployeeRoute';

// Pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NewsPage from '../pages/public/NewsPage';
import NewsSinglePage from '../pages/public/NewsSinglePage';
import OfficialsPage from '../pages/public/OfficialsPage';
import HistoryPage from '../pages/public/HistoryPage';
import CalendarPage from '../pages/public/CalendarPage';
import ContactPage from '../pages/public/ContactPage';
import RequestsPage from '../pages/public/RequestsPage';
import AccountPage from '../pages/user/AccountPage';
import SubmitTicketPage from '../pages/user/SubmitTicketPage';
import TicketsPage from '../pages/user/TicketsPage';
import DashboardPageAdmin from '../pages/admin/DashboardPage';
import EmployeeManagementPage from '../pages/admin/EmployeeManagementPage';
import SiteSettingsPage from '../pages/admin/SiteSettingsPage';
import UserManagementPageAdmin from '../pages/admin/UserManagementPage';
import DashboardPageEmployee from '../pages/employee/DashboardPage';
import EditPage from '../pages/employee/EditPage';
import NewsPageEmployee from '../pages/employee/NewsPage';
import RequestsPageEmployee from '../pages/employee/RequestsPage';
import TicketsPageEmployee from '../pages/employee/TicketsPage';
import UserManagementPageEmployee from '../pages/employee/UserManagementPage';
import NewsEditPage from '../pages/employee/NewsEditPage';
import RequestEditPage from '../pages/employee/RequestEditPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:slug" element={<NewsSinglePage />} />
      <Route path="/officials" element={<OfficialsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/requests" element={<RequestsPage />} />

      {/* User */}
      <Route path="/user/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
      <Route path="/user/submit-ticket" element={<PrivateRoute><SubmitTicketPage /></PrivateRoute>} />
      <Route path="/user/tickets" element={<PrivateRoute><TicketsPage /></PrivateRoute>} />

      {/* Employee */}
      <Route path="/employee/dashboard" element={<EmployeeRoute><DashboardPageEmployee /></EmployeeRoute>} />
      <Route path="/employee/pages/edit/:slug" element={<EmployeeRoute><EditPage /></EmployeeRoute>} />
      <Route path="/employee/news" element={<EmployeeRoute><NewsPageEmployee /></EmployeeRoute>} />
      <Route path="/employee/news/:slug/edit" element={<EmployeeRoute><NewsEditPage/></EmployeeRoute>}/>
      <Route path="/employee/requests" element={<EmployeeRoute><RequestsPageEmployee /></EmployeeRoute>} />
      <Route path="/employee/requests/:id/edit" element={<EmployeeRoute><RequestEditPage/></EmployeeRoute>}/>
      <Route path="/employee/tickets" element={<EmployeeRoute><TicketsPageEmployee /></EmployeeRoute>} />
      <Route path="/employee/users" element={<EmployeeRoute><UserManagementPageEmployee /></EmployeeRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><DashboardPageAdmin /></AdminRoute>} />
      <Route path="/admin/employees" element={<AdminRoute><EmployeeManagementPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><SiteSettingsPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UserManagementPageAdmin /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;