import React from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import LogoutButton from './LogoutButton';

function Dashboard() {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.is_superuser || decoded.is_staff;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">User Dashboard</h2>
      {isAdmin && (
        <div className="text-center mt-3">
          <Link to="/admin">
            <button className="btn btn-primary me-2">Go to Admin Dashboard</button>
          </Link>
        </div>
      )}
      <div className="text-center mt-3 mb-3">
        <Link to="/profile">
          <button className="btn btn-primary me-2">Go to Profile</button>
        </Link>
        <LogoutButton />
      </div>
      {/* Додайте інший контент дашборда тут */}
    </div>
  );
}

export default Dashboard;