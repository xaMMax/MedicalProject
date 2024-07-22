import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Button = ({ onClick, label, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant} mx-2 my-2`}>
      {label}
    </button>
  );
};

export default Button;