import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to the Consultation App</h1>
      <div className="mt-4">
        <Link to="/login">
          <button className="btn btn-primary me-3">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-secondary">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;