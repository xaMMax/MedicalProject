import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function CreateUserModal({ show, handleClose, handleUserCreated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    is_superuser: false,
    is_staff: false,
    is_doctor: false,
    is_user: true,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:8000/api/create-user/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        handleUserCreated(response.data);
        handleClose();
      })
      .catch((error) => {
        console.error('There was an error creating the user!', error);
        setError(error.response.data);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSuperuser">
            <Form.Check
              type="checkbox"
              name="is_superuser"
              label="Superuser"
              checked={formData.is_superuser}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formStaff">
            <Form.Check
              type="checkbox"
              name="is_staff"
              label="Staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDoctor">
            <Form.Check
              type="checkbox"
              name="is_doctor"
              label="Doctor"
              checked={formData.is_doctor}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateUserModal;