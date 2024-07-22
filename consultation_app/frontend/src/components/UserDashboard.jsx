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
import { verifyToken } from './tokenUtils';


const UserDashboard = () => {
  useSessionChecker();
  const token = localStorage.getItem('token');
  verifyToken(token);
  const [consultations, setConsultations] = useState([]);
  const [expiredConsultations, setExpiredConsultations] = useState([]);
  const [, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/consultations/', {
      headers: {
        Authorization: 'Bearer' + token,
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
  }, [token]);

  const handleCancelConsultation = async (id) => {
    const config = {
      headers: {
        Authorization: 'Bearer' + token
      }
    };
    try {
      await axios.delete(`http://localhost:8000/api/consultations/cancel/${id}/`, config);
      setConsultations(consultations.filter(consultation => consultation.id !== id));
      // Send a notification to the doctor
      await axios.post('http://localhost:8000/api/messages/', {
        recipient: consultations.find(c => c.id === id).doctor.id,
        content: 'The consultation has been cancelled by the patient.'
      }, config);
    } catch (error) {
      console.error('There was an error cancelling the consultation!', error);
    }
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">User Dashboard</h2>
      <div className="text-center mt-3 mb-3">
        <Link to="/profile">
          <Button label="Go to Profile" />
        </Link>
        <LogoutButton />
      </div>
      <SendMessage addMessage={addMessage} />
      <div className="mt-5">
        <h3>My Consultations</h3>
        {error && <div className="alert alert-danger">Error fetching consultations: {error.message}</div>}
        <div className="row">
          {consultations.map(consultation => (
            <Consultation
              key={consultation.id}
              consultation={consultation}
              role="user"
              handleCancel={handleCancelConsultation}
            />
          ))}
        </div>
      </div>
      <ExpiredConsultations
        consultations={expiredConsultations}
        role="user"
      />
      <MessageList addMessage={addMessage} /> {/* Додайте цей компонент */}
    </div>
  );
};

export default UserDashboard;