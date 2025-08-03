import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import logo from '../assets/jobmelaa-logo.png'; // ✅ import your logo

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="logo-wrapper">
        <Link to="/">
          <img src={logo} alt="Job Melaa Logo" className="navbar-logo" />
        </Link>
        <span className="brand-text">Job Melaa</span>
      </div>
      <ul>
        {user ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
