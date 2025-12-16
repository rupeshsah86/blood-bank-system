import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-main">About Our</span>
              <span className="title-highlight">Blood Bank System</span>
              <div className="title-icons">
                <span className="icon-pulse">🩸</span>
                <span className="icon-pulse">❤️</span>
                <span className="icon-pulse">🏥</span>
              </div>
            </h1>
            <p className="hero-subtitle">
              <span className="highlight-text">Dedicated to saving lives</span> through efficient blood donation management and 
              connecting generous donors with those in critical need.
            </p>
          </div>
        </section>
        
        <section className="mission">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              We are committed to bridging the gap between blood donors and patients in need. 
              Our advanced management system ensures that every drop of donated blood reaches 
              those who need it most, when they need it most.
            </p>
            <p>
              Through technology and compassion, we're building a network that saves lives 
              and strengthens communities across the healthcare ecosystem.
            </p>
          </div>
        </section>
        
        <section className="values">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item reliability">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.4 16 13V16C16 17.4 15.4 18 14.8 18H9.2C8.6 18 8 17.4 8 16V13C8 12.4 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
                </svg>
              </div>
              <h3>Reliability</h3>
              <p>24/7 system availability ensuring blood is always accessible when needed</p>
            </div>
            <div className="value-item transparency">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                </svg>
              </div>
              <h3>Transparency</h3>
              <p>Clear tracking and reporting for all blood donations and distributions</p>
            </div>
            <div className="value-item efficiency">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
                </svg>
              </div>
              <h3>Efficiency</h3>
              <p>Streamlined processes that minimize waste and maximize impact</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;