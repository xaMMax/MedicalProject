import React from 'react';
import PropTypes from 'prop-types';

const ExpiredConsultations = ({ consultations, role }) => {
  return (
    <div className="mt-5">
      <h3>Expired Consultations</h3>
      <ul className="list-group">
        {consultations.map(consultation => (
          <li key={consultation.id} className="list-group-item">
            <div>
              <h5 className="mb-1">{`Consultation with ${
                role === 'doctor'
                  ? consultation.patient.first_name + ' ' + consultation.patient.last_name
                  : consultation.doctor.first_name + ' ' + consultation.doctor.last_name
              }`}</h5>
              <p className="mb-1"><strong>Date:</strong> {consultation.date}</p>
              <p className="mb-1"><strong>Time:</strong> {consultation.time}</p>
              <p className="mb-1"><strong>Notes:</strong> {consultation.notes}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ExpiredConsultations.propTypes = {
  consultations: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
};

export default ExpiredConsultations;