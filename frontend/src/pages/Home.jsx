import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-gradient">Blood Donation</span> <span className="highlight">Saves Lives</span>
              <div className="title-decoration">
                <span className="blood-drop-mini">🩸</span>
                <span className="heart-beat">💖</span>
                <span className="medical-cross">⚕️</span>
              </div>
            </h1>
            <p className="hero-subtitle">
              <span className="subtitle-highlight">Connect donors with those in need.</span> Manage blood inventory efficiently. 
              Save lives through our comprehensive blood bank management system powered by modern technology.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-icon">🩸</span>
                <span className="stat-text">10,000+ Lives Saved</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-text">5,000+ Active Donors</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏥</span>
                <span className="stat-text">50+ Partner Hospitals</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Become a Donor
              </Link>
              <Link to="/find-donors" className="btn btn-secondary">
                Find Donors
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="blood-drop-large">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--blood-red)">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--blood-red)">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <h3>Donor Management</h3>
              <p>Comprehensive donor registration, tracking, and management system for efficient blood collection.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--medical-blue)">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3>Blood Availability</h3>
              <p>Real-time blood stock monitoring with automated alerts for low inventory and expiry tracking.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--life-green)">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3>Emergency Requests</h3>
              <p>Fast-track emergency blood requests with priority handling and instant notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Mission</h2>
              <p>
                Our Blood Bank Management System bridges the gap between generous donors 
                and patients in critical need. We leverage technology to make blood donation 
                more accessible, efficient, and impactful.
              </p>
              <p>
                Every donation through our platform has the potential to save up to three lives. 
                Join our community of heroes making a difference in healthcare.
              </p>
              <div className="stats">
                <div className="stat">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Lives Saved</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Active Donors</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Partner Hospitals</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="var(--gray-300)">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;