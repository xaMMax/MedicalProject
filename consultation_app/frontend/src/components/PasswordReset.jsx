import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function PasswordReset() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8000/api/reset-password/${uid}/${token}/`, { password, password2 })
      .then(response => {
        setMessage('Password has been reset successfully');
        setError('');
      })
      .catch(error => {
        setError('Error resetting password');
        setMessage('');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">Confirm New Password</label>
          <input
            type="password"
            name="password2"
            className="form-control"
            placeholder="Confirm new password"
            onChange={(e) => setPassword2(e.target.value)}
            value={password2}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Reset Password</button>
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}

export default PasswordReset;