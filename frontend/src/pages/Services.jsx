import './Services.css';

const Services = () => {
  return (
    <div className="services-page">
      <div className="container">
        <section className="services-hero">
          <h1>Our Services</h1>
          <p>Comprehensive blood bank management solutions</p>
        </section>
        
        <section className="services-list">
          <div className="service-card">
            <div className="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--blood-red)">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg>
            </div>
            <h3>Donor Registration</h3>
            <p>Easy registration process for new donors with comprehensive health screening</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--medical-blue)">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <h3>Inventory Management</h3>
            <p>Real-time tracking of blood stock levels with automated alerts</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--blood-red)">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <h3>Emergency Response</h3>
            <p>24/7 emergency blood request handling with priority processing</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--life-green)">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3>Quality Assurance</h3>
            <p>Rigorous testing and quality control for all blood products</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;