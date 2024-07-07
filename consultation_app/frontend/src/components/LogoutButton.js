import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger" style={{ margin: '8px 0' }}>
      Logout
    </button>
  );
}

export default LogoutButton;