import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-indigo-500 font-mono animate-pulse">VERIFYING_CREDENTIALS...</div>
      </div>
    );
  }

  // 1. If not logged in at all, go to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // 2. If it's an admin-only route but user is NOT an admin, go to user dashboard
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // 3. Otherwise, allow access
  return children;
};

export default ProtectedRoute;