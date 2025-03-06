import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.type)) {
    return <Navigate to={
            user.type === 'ADMIN' ? '/dashboard/admin' :
            user.type === 'EMPLOYEE' ? '/dashboard/employee' :
            '/dashboard/resident'
    } replace />;
  }

  return children ? children : <Outlet/>;
};

export default PrivateRoute;