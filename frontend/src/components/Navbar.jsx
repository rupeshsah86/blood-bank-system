import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import { authService } from '../features/auth/authService';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Left Side - Logo & Name */}
          <div className="navbar-brand">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--blood-red)">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="brand-name">Blood Bank System</span>
          </div>

          {/* Center - Navigation Links */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/find-donors" className="nav-link">Find Donors</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Right Side - User Menu */}
          <div className="navbar-actions">
            {user ? (
              <div className="user-menu">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <DropdownMenu />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;