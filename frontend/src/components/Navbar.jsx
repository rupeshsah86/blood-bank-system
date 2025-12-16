import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import { authService } from '../features/auth/authService';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar-content">
          {/* Left Side - Logo & Name */}
          <Link to="/" className="navbar-brand" aria-label="Blood Bank System - Go to homepage">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--blood-red)" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="brand-name">Blood Bank System</span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="navbar-links hidden-mobile" role="menubar">
            <Link to="/" className="nav-link" role="menuitem">Home</Link>
            <Link to="/find-donors" className="nav-link" role="menuitem">Find Donors</Link>
            <Link to="/about" className="nav-link" role="menuitem">About Us</Link>
            <Link to="/services" className="nav-link" role="menuitem">Services</Link>
            <Link to="/contact" className="nav-link" role="menuitem">Contact</Link>
          </div>

          {/* Right Side - User Menu */}
          <div className="navbar-actions">
            {user ? (
              <div className="user-menu hidden-mobile" role="group" aria-label="User menu">
                <Link to="/dashboard" className="nav-link" aria-label="Go to dashboard">Dashboard</Link>
                <button onClick={handleLogout} className="logout-btn" aria-label="Logout from account">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden-mobile">
                <DropdownMenu />
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn hidden-desktop"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu hidden-desktop">
            <div className="mobile-menu-links">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/find-donors" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Find Donors</Link>
              <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link to="/services" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="mobile-nav-link mobile-logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;