// src/routes/index.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import PrivateRoute from '../components/Layout/PrivateRoute';
import ResidentDashboard from '../components/Dashboard/ResidentDashboard';
import EmployeeDashboard from '../components/Dashboard/EmployeeDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import FormList from '../components/Forms/FormList';
import TicketList from '../components/Tickets/TicketList';
import UserList from '../components/Users/UserList';
import PageList from '../components/Pages/PageList';
import PageItem from '../components/Pages/PageItem';
import { useGetPageBySlug } from '../services/pageService';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useOfficialsPage = () => {
  return useGetPageBySlug('officials');
};

const OfficialsPage = () => {
    const { page, loading, error } = useOfficialsPage();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>; 
    }
    if (!page) {
        return <div>Page Not found</div>;
    }

    return <PageItem page={page} />;
}

const AppRoutes = () => {
    const { user, isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/officials" element={<OfficialsPage />} />

      {/* Nested routes for dashboards */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="resident" element={<ResidentDashboard />} />
        <Route path="employee" element={<EmployeeDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route index element={<Navigate to={
            isLoggedIn
              ? (
                user.type === 'ADMIN' ? 'admin' :
                user.type === 'EMPLOYEE' ? 'employee' :
                'resident'
              )
              : '/' // Redirect unauthenticated users to home
          } />} />
      </Route>

      <Route path="/forms" element={<PrivateRoute roles={['EMPLOYEE', 'ADMIN']}><FormList /></PrivateRoute>} />
      <Route path="/tickets" element={<PrivateRoute><TicketList /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute roles={['ADMIN', 'EMPLOYEE']}><UserList /></PrivateRoute>} />
      <Route path="/pages" element={<PageList />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;