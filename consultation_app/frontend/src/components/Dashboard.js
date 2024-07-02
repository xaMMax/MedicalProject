import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/consultations/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setConsultations(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the consultations!', error);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {consultations.map(consultation => (
          <li key={consultation.id}>
            {consultation.date} - {consultation.doctor.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;