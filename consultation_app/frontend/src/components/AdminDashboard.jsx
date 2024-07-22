import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import CreateUser from "./CreateUser";
import "bootstrap/dist/css/bootstrap.min.css";
import { verifyToken } from "./tokenUtils";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    is_superuser: false,
    is_staff: false,
    is_doctor: false
  });
  const [statistics, setStatistics] = useState({
    users_count: 0,
    consultations_count: 0,
    consultations_today: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };

      axios.get("http://localhost:8000/api/users/", { headers })
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the users!", error);
          setError(error);
        });

      axios.get("http://localhost:8000/api/statistics/", { headers })
        .then(response => {
          setStatistics(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the statistics!", error);
        });
    }
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      is_superuser: user.is_superuser,
      is_staff: user.is_staff,
      is_doctor: user.is_doctor
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEditSubmit = () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.put(`http://localhost:8000/api/users/${selectedUser.id}/`, formData, { headers })
      .then(response => {
        setUsers(users.map(user => user.id === selectedUser.id ? response.data : user));
        setShowEditModal(false);
      })
      .catch(error => {
        console.error("There was an error updating the user!", error);
      });
  };

  const handleDeleteClick = (userId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.delete(`http://localhost:8000/api/users/${userId}/`, { headers })
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error("There was an error deleting the user!", error);
      });
  };

  const handlePasswordReset = (user) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.post("http://localhost:8000/api/password-reset/", { email: user.email }, { headers })
      .then(response => {
        alert(`Password reset link sent to ${user.email}`);
      })
      .catch(error => {
        console.error("There was an error sending the password reset link!", error);
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Admin Dashboard</h2>
      {error && <div className="alert alert-danger">Error fetching users: {error.message}</div>}
      <div className="text-center mt-3 mb-3">
        <Link to="/profile">
          <button className="btn btn-primary me-2">Go to User Profile</button>
        </Link>
        <LogoutButton />
      </div>
      <Row className="mb-4">
        <Col md={4}>
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total Users</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.users_count}</h5>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total Consultations</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.consultations_count}</h5>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Consultations Today</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.consultations_today}</h5>
            </div>
          </div>
        </Col>
      </Row>

      <div className="text-end mb-3">
        <Button variant="success" onClick={() => setShowCreateUser(true)}>Create New User</Button>
      </div>

      <CreateUser show={showCreateUser} handleClose={() => setShowCreateUser(false)} />

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Superuser</th>
            <th>Staff</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_superuser ? "Yes" : "No"}</td>
              <td>{user.is_staff ? "Yes" : "No"}</td>
              <td>{user.is_doctor ? "Yes" : "No"}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEditClick(user)}>Edit</button>
                <button className="btn btn-danger me-2" onClick={() => handleDeleteClick(user.id)}>Delete</button>
                <button className="btn btn-info" onClick={() => handlePasswordReset(user)}>Send Password Reset Link</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSuperuser">
              <Form.Check
                type="checkbox"
                name="is_superuser"
                label="Superuser"
                checked={formData.is_superuser}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStaff">
              <Form.Check
                type="checkbox"
                name="is_staff"
                label="Staff"
                checked={formData.is_staff}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDoctor">
              <Form.Check
                type="checkbox"
                name="is_doctor"
                label="Doctor"
                checked={formData.is_doctor}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
        );
      }
export default AdminDashboard;