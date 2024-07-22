import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ element: Element, adminRoute, doctorRoute, ...rest }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let isAdmin = false;
  let isDoctor = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAuthenticated = true;
    isAdmin = decoded.is_superuser || decoded.is_staff;
    isDoctor = decoded.is_doctor;
  }

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (adminRoute && !isAdmin) {
    return <Navigate to="/user-dashboard" />;
  }

  if (doctorRoute && !isDoctor) {
    return <Navigate to="/user-dashboard" />;
  }

  return <Element {...rest} />;
};

export default ProtectedRoute;