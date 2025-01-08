import React from 'react';
import "../../styles/policy/PolicyPages.css";

const ContactUs = () => {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>We value your feedback and are here to assist with any queries, support requests, or concerns.</p>
      <ul>
        <li>Email: <a href="mailto:sayar@thesayar.com">sayar@thesayar.com</a></li>
        <li>Phone: +91-6282579845 (Monday to Friday, 9:00 AM to 6:00 PM)</li>
        {/* <li>Address: 123 Main Street, City, Country</li> */}
      </ul>
      <p>For urgent inquiries, please email us for a faster response.</p>
    </div>
  );
};

export default ContactUs;
