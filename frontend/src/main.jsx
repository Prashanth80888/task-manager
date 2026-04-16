import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import this
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Ensure this is wrapped too
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);