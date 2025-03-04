import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // redirect non authenticated
    return <Navigate to="/login" replace />;
  }

  return children; // render
}

export default PrivateRoute;