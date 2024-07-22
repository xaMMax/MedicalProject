import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import Button from './Button';
import Consultation from './Consultation';
import ExpiredConsultations from './ExpiredConsultations';
import SendMessage from './SendMessage';
import MessageList from './MessageList';
import useSessionChecker from "./useSessionChecker";
import ConsultationModal from './ConsultationModal';
import { verifyToken } from './tokenUtils';  // Імпортуємо компонент для роботи з токенами

const DoctorDashboard = () => {
  useSessionChecker();
  const token = localStorage.getItem('token');
  verifyToken(token);
  const [consultations, setConsultations] = useState([]);
  const [expiredConsultations, setExpiredConsultations] = useState([]);
  const [, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    date: '',
    time: '',
    notes: ''
  });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    axios.get('http://localhost:8000/api/doctor/consultations/', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then(response => {
      const currentDate = new Date();
      const activeConsultations = response.data.filter(
        consultation => new Date(consultation.date) >= currentDate
      );
      const expiredConsultations = response.data.filter(
        consultation => new Date(consultation.date) < currentDate
      );
      setConsultations(activeConsultations);
      setExpiredConsultations(expiredConsultations);
    })
    .catch(error => {
      console.error('There was an error fetching the consultations!', error);
      setError(error);
    });

    // Fetch patients for the select input
    axios.get('http://localhost:8000/api/patients/', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then(response => {
      setPatients(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the patients!', error);
      setError(error);
    });
  }, [token]);

  const handleCancelConsultation = async (id) => {
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    };
    try {
      await axios.delete(`http://localhost:8000/api/consultations/cancel/${id}/`, config);
      setConsultations(consultations.filter(consultation => consultation.id !== id));
      // Send a notification to the patient
      await axios.post('http://localhost:8000/api/messages/', {
        recipient: consultations.find(c => c.id === id).patient.id,
        content: 'Your consultation has been cancelled by the doctor.'
      }, config);
    } catch (error) {
      console.error('There was an error cancelling the consultation!', error);
    }
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    };

    try {
      const response = await axios.post('http://localhost:8000/api/doctor/consultations/', formData, config);
      setConsultations([...consultations, response.data]);
      handleModalClose();
    } catch (error) {
      console.error('There was an error creating the consultation!', error);
      setError(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Doctor Dashboard</h2>
      <div className="text-center mt-3 mb-3">
        <Link to="/profile">
          <Button label="Go to Profile" />
        </Link>
        <LogoutButton />
      </div>
      <Button label="Add Consultation" onClick={handleModalShow} />
      <ConsultationModal
        formData={formData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        patients={patients}
        showModal={showModal}
        handleModalClose={handleModalClose}
      />
      <SendMessage addMessage={addMessage} />
      <div className="mt-5">
        <h3>My Consultations</h3>
        {error && <div className="alert alert-danger">Error fetching consultations: {error.message}</div>}
        <div className="row">
          {consultations.map(consultation => (
            <Consultation
              key={consultation.id}
              consultation={consultation}
              role="doctor"
              handleCancel={handleCancelConsultation}
            />
          ))}
        </div>
      </div>
      <ExpiredConsultations
        consultations={expiredConsultations}
        role="doctor"
      />
      <MessageList addMessage={addMessage} />
    </div>
  );
};

export default DoctorDashboard;