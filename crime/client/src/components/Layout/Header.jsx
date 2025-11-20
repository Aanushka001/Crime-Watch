import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../utils/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const headerStyles = {
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1e40af 100%)',
    color: '#ffffff',
    padding: '1.2rem 2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(12px)',
    borderBottom: '3px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease'
  };

  const navStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const logoIconStyles = {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
  };

  const titleStyles = {
    margin: 0,
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #ffffff, #f1f5f9, #cbd5e1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 900,
    letterSpacing: '-0.8px',
    textShadow: '0 3px 12px rgba(0, 0, 0, 0.3)',
    position: 'relative'
  };

  const subtitleStyles = {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 500,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginTop: '0.2rem'
  };

  const navLinkStyles = {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    padding: '0.7rem 1.4rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const profileToggleStyles = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.7rem 1.3rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    fontWeight: 600
  };

  const profileDropdownStyles = {
    position: 'absolute',
    top: 'calc(100% + 1rem)',
    right: 0,
    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    borderRadius: '16px',
    zIndex: 1000,
    minWidth: '240px',
    border: '1px solid #475569',
    overflow: 'hidden',
    animation: 'slideDown 0.3s ease'
  };

  const profileListStyles = {
    listStyleType: 'none',
    padding: '0.5rem 0',
    margin: 0
  };

  const profileItemStyles = {
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    color: '#cbd5e1',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    borderLeft: '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header style={headerStyles}>
      <nav style={navStyles}>
        <div style={logoContainerStyles}>
          <span style={logoIconStyles}>🚨</span>
          <div>
            <h1 style={titleStyles}>Crime Watch</h1>
            <div style={subtitleStyles}>Stay Safe • Stay Informed</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Link 
            to="/" 
            style={navLinkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🏠 Home
          </Link>
          
          {!user && (
            <>
              <Link 
                to="/login" 
                style={navLinkStyles}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🔐 Login
              </Link>
              <Link 
                to="/register" 
                style={navLinkStyles}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✍️ Register
              </Link>
            </>
          )}
          
          {user && (
            <>
              <Link 
                to="/report" 
                style={{
                  ...navLinkStyles,
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
              >
                📝 Report Crime
              </Link>
              
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={toggleProfileMenu} 
                  style={profileToggleStyles}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaUser style={{ fontSize: '1.2rem', color: '#f59e0b' }} />
                  <span>{user.displayName || 'Profile'}</span>
                </div>
                
                {showProfileMenu && (
                  <div style={profileDropdownStyles}>
                    <ul style={profileListStyles}>
                      <li 
                        style={profileItemStyles}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                          e.currentTarget.style.borderLeftColor = '#3b82f6';
                          e.currentTarget.style.paddingLeft = '1.8rem';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                          e.currentTarget.style.paddingLeft = '1.5rem';
                        }}
                      >
                        <Link 
                          to="/profile" 
                          style={{ 
                            textDecoration: 'none', 
                            color: 'inherit', 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            width: '100%'
                          }}
                        >
                          <FaUser style={{ color: '#3b82f6' }} />
                          <span>View Profile</span>
                        </Link>
                      </li>
                      <li 
                        style={{ ...profileItemStyles, borderTop: '1px solid #334155', marginTop: '0.3rem', paddingTop: '1rem' }}
                        onClick={handleLogout}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                          e.currentTarget.style.borderLeftColor = '#ef4444';
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.paddingLeft = '1.8rem';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                          e.currentTarget.style.color = '#cbd5e1';
                          e.currentTarget.style.paddingLeft = '1.5rem';
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>🚪</span>
                        <span>Logout</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;