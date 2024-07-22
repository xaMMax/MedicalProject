import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { verifyToken } from "./tokenUtils";

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
        const { access } = response.data;

        localStorage.setItem('token', access);
        const decoded = verifyToken(access);
        console.log('Welcome superuser ', decoded.is_superuser);
        console.log('Welcome staff ',decoded.is_staff);
        console.log('Welcome doctor ',decoded.is_doctor);
        console.log('Welcome user ',decoded.is_user);

        if (decoded.is_superuser || decoded.is_staff) {
            navigate('/admin');
        } else if (decoded.is_doctor) {
            navigate('/doctor-dashboard');
        } else {
            navigate('/user-dashboard');
        }
      })
      .catch(error => {
        setError('Invalid username or password');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
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