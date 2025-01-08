import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; // Optional: Add a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <ul className="footer-links">
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>
          <li>
            <Link to="/terms-of-service">Terms & Conditions</Link>
          </li>
          <li>
            <Link to="/refund-policy">Refunds & Cancellations</Link>
          </li>
          <li>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
