import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DropdownMenu.css';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="6" r="3"/>
          <path d="M12 14c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/login" className="dropdown-item" onClick={() => setIsOpen(false)}>
            Admin Login
          </Link>
          <Link to="/login" className="dropdown-item" onClick={() => setIsOpen(false)}>
            User Login
          </Link>
          <Link to="/register" className="dropdown-item" onClick={() => setIsOpen(false)}>
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;