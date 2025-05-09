import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <span className="logo-text">RentMate</span>
            </Link>
            <p className="footer-description">
              Find your perfect rental property with ease. RentMate provides a seamless experience for both tenants and property owners.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/auth">Login / Sign Up</Link></li>
            </ul>
          </div>
          
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Have questions? Get in touch with us.</p>
            <p className="contact-info">
              <span>Email: info@rentmate.com</span>
              <span>Phone: +1 (555) 123-4567</span>
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} RentMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;