import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAuthenticated = true;
    isAdmin = decoded.is_superuser || decoded.is_staff;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (rest.path === '/admin' && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;