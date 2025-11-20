import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaShieldAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const footerStyles = {
    background: 'linear-gradient(135deg, #1e40af 0%, #1e293b 50%, #0f172a 100%)',
    color: '#ffffff',
    padding: '3rem 2rem 1.5rem',
    marginTop: 'auto',
    borderTop: '3px solid rgba(59, 130, 246, 0.3)',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  };

  const footerGlowStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none'
  };

  const contentStyles = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2.5rem',
    position: 'relative',
    zIndex: 1
  };

  const sectionStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const sectionTitleStyles = {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const linkStyles = {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderLeft: '2px solid transparent'
  };

  const socialLinksStyles = {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  };

  const socialIconStyles = {
    fontSize: '1.8rem',
    color: '#cbd5e1',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const bottomBarStyles = {
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
    position: 'relative',
    zIndex: 1
  };

  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '20px',
    color: '#60a5fa',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginTop: '1rem'
  };

  return (
    <footer style={footerStyles}>
      <div style={footerGlowStyles}></div>
      
      <div style={contentStyles}>
        {/* About Section */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>
            <span style={{ fontSize: '1.5rem' }}>🚨</span>
            Crime Watch
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Empowering communities with real-time crime reporting and safety analytics. 
            Together, we make our neighborhoods safer.
          </p>
          <div style={badgeStyles}>
            <FaShieldAlt />
            <span>Protecting Communities Since 2024</span>
          </div>
        </div>

        {/* Quick Links */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>
            <span>⚡</span>
            Quick Links
          </h3>
          <a 
            href="/" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>🏠</span> Home
          </a>
          <a 
            href="/report" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>📝</span> Report Crime
          </a>
          <a 
            href="/about" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>ℹ️</span> About Us
          </a>
        </div>

        {/* Resources */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>
            <span>📚</span>
            Resources
          </h3>
          <a 
            href="/safety-tips" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>🛡️</span> Safety Tips
          </a>
          <a 
            href="/privacy" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>🔒</span> Privacy Policy
          </a>
          <a 
            href="/terms" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>📄</span> Terms of Service
          </a>
          <a 
            href="/contact" 
            style={linkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.paddingLeft = '0.8rem';
              e.currentTarget.style.borderLeftColor = '#3b82f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.paddingLeft = '0';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            <span>📧</span> Contact Support
          </a>
        </div>

        {/* Connect Section */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>
            <span>🌐</span>
            Connect With Us
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Follow us on social media for updates and community safety alerts
          </p>
          <div style={socialLinksStyles}>
            <div 
              style={socialIconStyles}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaGithub />
            </div>
            <div 
              style={socialIconStyles}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#1DA1F2';
                e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 161, 242, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaTwitter />
            </div>
            <div 
              style={socialIconStyles}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#0A66C2';
                e.currentTarget.style.background = 'rgba(10, 102, 194, 0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 102, 194, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaLinkedin />
            </div>
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.85rem',
            color: '#a7f3d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <span style={{ fontSize: '1.2rem' }}>🆘</span>
              Emergency: Call 911
            </div>
          </div>
        </div>
      </div>

      <div style={bottomBarStyles}>
        <p style={{ margin: '0.5rem 0', color: '#cbd5e1', fontSize: '1rem', fontWeight: 500 }}>
          © 2024 Crime Watch. All rights reserved.
        </p>
        <p style={{ margin: '0.8rem 0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Made with <FaHeart style={{ color: '#ef4444' }} /> for safer communities
        </p>
        <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.85rem' }}>
          Real-time crime reporting • Community safety analytics • Trusted by thousands
        </p>
      </div>
    </footer>
  );
};

export default Footer;