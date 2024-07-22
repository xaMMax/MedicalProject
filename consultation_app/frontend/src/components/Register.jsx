import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/register/', formData)
      .then(response => {
        console.log(response.data);
        setFormData({
          username: '',
          password: '',
          password2: '',
          email: '',
          first_name: '',
          last_name: ''
        });
        setErrors({});
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
      <h2 className="text-center">Register</h2>
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
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
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
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">Confirm Password</label>
          <input
            type="password"
            name="password2"
            className="form-control"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.password2}
          />
          {errors.password2 && <div className="text-danger">{errors.password2}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.first_name}
          />
          {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.last_name}
          />
          {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
        <Link to="/" className="btn btn-secondary w-100">Back to Home</Link>
      </form>
    </div>
  );
}

export default Register;