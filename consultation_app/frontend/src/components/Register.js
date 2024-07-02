import React, { useState } from 'react';
import axios from 'axios';

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
        // Clear form and errors on successful registration
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
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username} />
      {errors.username && <p>{errors.username}</p>}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
      {errors.email && <p>{errors.email}</p>}
      <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} />
      {errors.password && <p>{errors.password}</p>}
      <input type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} value={formData.password2} />
      {errors.password2 && <p>{errors.password2}</p>}
      <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} value={formData.first_name} />
      {errors.first_name && <p>{errors.first_name}</p>}
      <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} value={formData.last_name} />
      {errors.last_name && <p>{errors.last_name}</p>}
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;