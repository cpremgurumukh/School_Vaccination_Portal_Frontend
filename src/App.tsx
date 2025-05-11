import React from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import DrivesPage from './pages/DrivesPage';
import ReportsPage from './pages/ReportsPage'; // <-- Add this line
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { isAuthenticated } from './components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userIsAuthenticated = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const ProtectedLayout: React.FC = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
        <>
            <Navbar onLogout={handleLogout} />
            <div className="container">
                <Outlet />
            </div>
        </>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/drives" element={<DrivesPage />} />
          <Route path="/reports" element={<ReportsPage />} /> {/* <-- Add this route */}
        </Route>

        <Route path="*" element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
};

export default App;