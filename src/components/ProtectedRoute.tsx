import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// This is now a very simple check.
// In a real app, you might want a backend endpoint to verify session validity.
export const isAuthenticated = (): boolean => {
  const authFlag = localStorage.getItem('isAuthenticated');
  return authFlag === 'true';
};

const ProtectedRoute: React.FC = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;