import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import SeekerDashboard from './components/SeekerDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import JobDetails from './components/JobDetails';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/seeker/dashboard"
            element={
              <PrivateRoute allowedRoles={['seeker']}>
                <SeekerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/recruiter/dashboard"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </PrivateRoute>
            }
          />

          {/* Dynamic route for job details (seeker) */}
          <Route
            path="/jobs/:id"
            element={
              <PrivateRoute allowedRoles={['seeker']}>
                <JobDetails />
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
