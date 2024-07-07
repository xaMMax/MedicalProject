import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard'; // Додано
import UserProfile from './components/UserProfile'; // Додано
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} adminRoute />} />
        <Route path="/doctor-dashboard" element={<ProtectedRoute element={DoctorDashboard} doctorRoute />} />
        <Route path="/profile" element={<ProtectedRoute element={UserProfile} />} />
      </Routes>
    </Router>
  );
}

export default App;