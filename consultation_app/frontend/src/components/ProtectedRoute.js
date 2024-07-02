import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.is_superuser || decoded.is_staff;
  }

  return (
    token ? (
      rest.path === '/admin' && !isAdmin ? (
        <Navigate to="/dashboard" />
      ) : (
        <Component {...rest} />
      )
    ) : (
      <Navigate to="/login" />
    )
  );
};

export default ProtectedRoute;