import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming your Navbar component is here

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {/* Outlet is where the matched child route component will be rendered */}
        <Outlet />
      </main>
      {/* You could also add a Footer here if it's common to all pages */}
    </div>
  );
};

export default Layout;