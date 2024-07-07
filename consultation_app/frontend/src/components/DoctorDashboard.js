import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

function DoctorDashboard() {
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    patient: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/doctor/consultations/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setConsultations(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the consultations!', error);
      setError(error);
    });

    axios.get('http://localhost:8000/api/patients/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setPatients(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the patients!', error);
    });
  }, []);

  const handleShowModal = (type, consultation = {}) => {
    setModalType(type);
    setFormData({
      id: consultation.id || '',
      patient: consultation.patient || '',
      date: consultation.date || '',
      time: consultation.time || '',
      notes: consultation.notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id: '',
      patient: '',
      date: '',
      time: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      if (modalType === 'add') {
        const response = await axios.post('http://localhost:8000/api/doctor/consultations/', formData, config);
        setConsultations([...consultations, response.data]);
      } else {
        const response = await axios.put(`http://localhost:8000/api/doctor/consultations/${formData.id}/`, formData, config);
        setConsultations(consultations.map(consultation => consultation.id === formData.id ? response.data : consultation));
      }
      handleCloseModal();
    } catch (error) {
      console.error('There was an error saving the consultation!', error);
    }
  };

  const handleDeleteConsultation = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/doctor/consultations/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setConsultations(consultations.filter(consultation => consultation.id !== id));
    } catch (error) {
      console.error('There was an error deleting the consultation!', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Doctor Dashboard</h2>
      {error && <div className="alert alert-danger">Error fetching consultations: {error.message}</div>}
      <div className="text-center mt-3 mb-3">
        <Link to="/profile">
          <button className="btn btn-primary me-2">Go to User profile</button>
        </Link>
        <LogoutButton />
      </div>
      <div className="text-center mb-3">
        <Button onClick={() => handleShowModal('add')} className="btn btn-success">Add Consultation</Button>
      </div>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map(consultation => (
            <tr key={consultation.id}>
              <td>{consultation.id}</td>
              <td>{consultation.patient.first_name} {consultation.patient.last_name}</td>
              <td>{consultation.date}</td>
              <td>{consultation.time}</td>
              <td>{consultation.notes}</td>
              <td>
                <Button className="btn btn-warning me-2" onClick={() => handleShowModal('edit', consultation)}>Edit</Button>
                <Button className="btn btn-danger" onClick={() => handleDeleteConsultation(consultation.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Add Consultation' : 'Edit Consultation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formPatient">
              <Form.Label>Patient</Form.Label>
              <Form.Control
                as="select"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.username}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DoctorDashboard;