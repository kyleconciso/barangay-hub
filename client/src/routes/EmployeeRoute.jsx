import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function EmployeeRoute({ children }) {
  const { user } = useAuth();

  if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default EmployeeRoute;