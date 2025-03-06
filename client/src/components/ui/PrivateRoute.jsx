import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PrivateRoute({ children, roles, redirectTo = '/sign-in' }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated redirect to the specified route
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  // If roles are specified and the user doesn't have the required role redirect to home
  if (roles && !roles.includes(currentUser.type)) {
    return <Navigate to="/" replace />; // Redirect  "not authorized" page
  }

  // If authenticated and authorized render the children
  return children;
}

export default PrivateRoute;