import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Consultation = ({ consultation, role, handleCancel }) => {
  const { id, patient, doctor, date, time, notes } = consultation;
  const userRole = role === 'doctor' ? patient : doctor;

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <h5 className="mb-1">{`Consultation with ${userRole.first_name} ${userRole.last_name}`}</h5>
        <p className="mb-1"><strong>Date:</strong> {date}</p>
        <p className="mb-1"><strong>Time:</strong> {time}</p>
        <p className="mb-1"><strong>Notes:</strong> {notes}</p>
      </div>
      {role === 'user' && (
        <div>
          <Button
            label="Cancel"
            variant="danger"
            onClick={() => handleCancel(id)}
          />
        </div>
      )}
    </li>
  );
};

Consultation.propTypes = {
  consultation: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default Consultation;