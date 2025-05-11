import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const username = localStorage.getItem('username'); // Assuming 'username' is stored, not the full email

  return (
    <nav className="app-navbar"> {/* Parent flex container */}
      <div className="navbar-links"> {/* First flex item */}
        <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/drives">Vaccination Drives</Link></li>
        <li><Link to="/reports">Vaccination Reports</Link></li> 
      </ul>
      </div>
      <div className="navbar-user-actions"> {/* Second flex item */}
        <ul>
          {username && (
            <li className="nav-username">Welcome, {username}</li>
          )}
          <li>
            <button onClick={onLogout} className="nav-logout-button">
            Logout
          </button>
        </li>
      </ul>
      </div>
    </nav>
  );
};

export default Navbar;