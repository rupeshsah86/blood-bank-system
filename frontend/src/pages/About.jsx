import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero">
          <h1>About Our Blood Bank System</h1>
          <p>Dedicated to saving lives through efficient blood donation management</p>
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
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Reliability</h3>
              <p>24/7 system availability ensuring blood is always accessible when needed</p>
            </div>
            <div className="value-item">
              <h3>Transparency</h3>
              <p>Clear tracking and reporting for all blood donations and distributions</p>
            </div>
            <div className="value-item">
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