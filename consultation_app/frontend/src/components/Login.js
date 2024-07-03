import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/token/', formData)
      .then(response => {
        const token = response.data.access;
        const decoded = jwtDecode(token);
        console.log('User authenticated:', decoded);
        localStorage.setItem('token', token);
        navigate('/dashboard');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          console.error('There was an error!', error);
        }
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        <Link to="/password-reset" className="btn btn-link w-100">Forgot Password?</Link>
        <button onClick={() => navigate('/')} className="btn btn-secondary w-100">Back to Home</button>
      </form>
    </div>
  );
}

export default Login;