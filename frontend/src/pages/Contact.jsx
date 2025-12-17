import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <section className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-main">Contact Our</span>
              <span className="title-highlight">Medical Team</span>
              <div className="title-icons">
                <span className="icon-pulse">📞</span>
                <span className="icon-pulse">✉️</span>
                <span className="icon-pulse">🏥</span>
              </div>
            </h1>
            <p className="hero-subtitle">
              <span className="highlight-text">Available 24/7 for emergencies</span> - Connect with our blood bank professionals 
              for assistance, inquiries, and life-saving support.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <h2 className="section-title">Get In Touch With Us</h2>
          <div className="contact-content">
            <div className="contact-info">
            <h2>Get In Touch</h2>
            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--blood-red-500)">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div>
                <h3>Address</h3>
                <p>Medical Center Drive<br/>Healthcare Nepal, Malangwa 45800</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--medical-blue-500)">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <div>
                <h3>Phone</h3>
                <p>Emergency: 911<br/>General: +9779840135047</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--life-green-500)">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <h3>Email</h3>
                <p>rupesh@bloodbank.com<br/>emergency@bloodbank.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--warning-orange-500)">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div>
                <h3>Hours</h3>
                <p>24/7 Emergency Service<br/>Office: Mon-Fri 8AM-6PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Message</h2>
            {submitted ? (
              <div className="success-message">
                <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="donation">Blood Donation</option>
                      <option value="request">Blood Request</option>
                      <option value="general">General Inquiry</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;