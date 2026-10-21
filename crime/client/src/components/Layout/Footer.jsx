import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: '#101114',
    color: '#A8AFBC',
    padding: '2.5rem 2rem 1.5rem',
    marginTop: 'auto',
    borderTop: '1px solid #3B414D'
  }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '2rem'
    }}>
      <section>
        <h2 style={{ color: '#F3F4F6', fontSize: '1.2rem' }}>Crime Watch</h2>
        <p style={{ lineHeight: 1.6 }}>
          Community crime reporting and safety analytics.
        </p>
      </section>

      <nav aria-label="Quick links">
        <h2 style={{ color: '#F3F4F6', fontSize: '1.1rem' }}>Quick Links</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/report" className="footer-link">Report Crime</Link>
          <Link to="/about" className="footer-link">About Us</Link>
        </div>
      </nav>

      <nav aria-label="Resources">
        <h2 style={{ color: '#F3F4F6', fontSize: '1.1rem' }}>Resources</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Link to="/safety-tips" className="footer-link">Safety Tips</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/contact" className="footer-link">Contact Support</Link>
        </div>
      </nav>
    </div>

    <div style={{
      maxWidth: '1400px',
      margin: '2rem auto 0',
      paddingTop: '1.25rem',
      borderTop: '1px solid #3B414D',
      textAlign: 'center',
      fontSize: '0.9rem'
    }}>
      © 2024 Crime Watch. All rights reserved.
    </div>
  </footer>
);

export default Footer;
