import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    bio: '',
    photo: null,
  });

  const token = localStorage.getItem('token');
  let isAdmin = false;
  let isDoctor = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.is_superuser || decoded.is_staff;
    isDoctor = decoded.is_doctor;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user-profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          phone: response.data.phone,
          address: response.data.address,
          bio: response.data.bio,
          photo: null, // photo не передається як початкове значення
        });
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append('phone', formData.phone);
    updatedFormData.append('address', formData.address);
    updatedFormData.append('bio', formData.bio);

    // Додавати фото лише якщо воно вибране
    if (formData.photo) {
      updatedFormData.append('photo', formData.photo);
    }

    try {
      const response = await axios.put('http://localhost:8000/api/user-profile/', updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user data', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img src={`${user.photo}`} alt="User Avatar"
                   className="img-fluid rounded-circle mb-3"
                   style={{ width: '150px', height: '150px', objectFit: 'cover'}} />
              <h4>{user.username}</h4>
              <p className="text-muted">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile Details</h5>
              <p className="card-text"><strong>Phone:</strong> {user.phone}</p>
              <p className="card-text"><strong>Address:</strong> {user.address}</p>
              <p className="card-text"><strong>Bio:</strong> {user.bio}</p>
              <button className="btn btn-primary" onClick={handleEditClick}>Edit Profile</button>
              <div className="mt-3">
                <Link to={isAdmin ? "/admin" : isDoctor ? "/doctor-dashboard" : "/dashboard"}>
                  <button className="btn btn-secondary">Back to Dashboard</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutButton />

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhoto">
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserProfile;