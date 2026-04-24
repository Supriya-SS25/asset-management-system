import React from 'react';
import './Navbar.css';

const Navbar = ({ title = "Student Dashboard" }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <h1>{title}</h1>
        </div>
        <div className="navbar-menu">
          <a href="#home" className="nav-link">Home</a>
          <a href="#students" className="nav-link">Students</a>
          <a href="#about" className="nav-link">About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
