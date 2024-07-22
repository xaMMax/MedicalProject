import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<ProtectedRoute element={UserDashboard} />} />
        <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} adminRoute />} />
        <Route path="/doctor-dashboard" element={<ProtectedRoute element={DoctorDashboard} doctorRoute />} />
        <Route path="/profile" element={<ProtectedRoute element={UserProfile} />} />

      </Routes>
    </Router>
  );
}

export default App;