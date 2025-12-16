import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Blood Bank System</h3>
            <p>Saving lives through blood donation management</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/find-donors">Find Donors</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Emergency: 911</p>
            <p>Info: contact@bloodbank.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Blood Bank System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;