import './Services.css';

const Services = () => {
  return (
    <div className="services-page">
      <div className="container">
        <section className="services-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-icon">🏥</span>
              <span className="title-text">Our Services</span>
              <div className="title-decoration">
                <span className="deco-icon">🩸</span>
                <span className="deco-icon">⚕️</span>
                <span className="deco-icon">❤️</span>
              </div>
            </h1>
            <p className="hero-subtitle">
              <span className="highlight">Comprehensive blood bank management solutions</span> 
              designed to save lives and support healthcare professionals.
            </p>
          </div>
        </section>
        
        <section className="services-list">
          <div className="service-card donor-card">
            <div className="service-icon">
              <div className="icon-bg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
            </div>
            <h3>Donor Registration</h3>
            <p>Easy registration process for new donors with comprehensive health screening and eligibility verification</p>
            <div className="service-badge">Essential</div>
          </div>
          
          <div className="service-card inventory-card">
            <div className="service-icon">
              <div className="icon-bg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
            </div>
            <h3>Inventory Management</h3>
            <p>Real-time tracking of blood stock levels with automated alerts and expiry date monitoring</p>
            <div className="service-badge">Advanced</div>
          </div>
          
          <div className="service-card emergency-card">
            <div className="service-icon">
              <div className="icon-bg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <h3>Emergency Response</h3>
            <p>24/7 emergency blood request handling with priority processing and rapid deployment</p>
            <div className="service-badge urgent">Critical</div>
          </div>
          
          <div className="service-card quality-card">
            <div className="service-icon">
              <div className="icon-bg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <h3>Quality Assurance</h3>
            <p>Rigorous testing and quality control for all blood products ensuring safety and reliability</p>
            <div className="service-badge">Premium</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;