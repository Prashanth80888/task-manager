import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Import the new page
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* PUBLIC: Login & Register */}
        <Route path="/" element={<AuthPage />} />

        {/* PROTECTED: User Workspace */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* PROTECTED: Admin Global Override */}
       {/* App.js snippet */}
        <Route
          path="/admin/override"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;