// FILE: ./client/src/components/Layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const footerStyles = {
    background: 'linear-gradient(135deg, #1e40af 0%, #1e293b 100%)',
    color: '#ffffff',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    marginTop: 'auto',
    borderTop: '2px solid #2563eb',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)'
  };

  const contentStyles = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const linkStyles = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    position: 'relative'
  };

  const linksContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '0.8rem',
    flexWrap: 'wrap'
  };

  return (
    <footer style={footerStyles}>
      <div style={contentStyles}>
        <p style={{ margin: '0.3rem 0', color: '#e2e8f0', fontSize: '0.95rem' }}>
          &copy; 2024 Crime Watch. All rights reserved.
        </p>
        <p style={{ margin: '0.3rem 0', color: '#e2e8f0', fontSize: '0.95rem' }}>
          Providing real-time crime reporting and safety information.
        </p>
        <div style={linksContainerStyles}>
          <a href="/privacy" style={linkStyles}>Privacy Policy</a>
          <a href="/terms" style={linkStyles}>Terms of Service</a>
          <a href="/contact" style={linkStyles}>Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;