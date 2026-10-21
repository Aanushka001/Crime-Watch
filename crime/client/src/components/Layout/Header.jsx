import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logout } from '../../utils/api';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const { user, clearSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const headerStyles = {
    background: '#101114',
    color: '#F3F4F6',
    padding: '1.2rem 2rem',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #3B414D',
    transition: 'all 0.3s ease'
  };

  const navStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const brandStyles = {
    display: 'flex',
    alignItems: 'center'
  };

  const titleStyles = {
    margin: 0,
    fontSize: '2rem',
    background: 'none',
    WebkitBackgroundClip: 'text',
    color: '#F3F4F6',
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
    background: 'transparent',
    border: '1px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const profileToggleStyles = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.7rem 1.3rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: '#191B20',
    border: '1px solid #3B414D',
    fontWeight: 600
  };

  const profileDropdownStyles = {
    position: 'absolute',
    top: 'calc(100% + 1rem)',
    right: 0,
    background: '#191B20',
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
    color: '#A8AFBC',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    borderLeft: '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearSession();
      setShowProfileMenu(false);
      setLogoutError('');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError(error.response?.data?.error || 'Unable to sign out. Please try again.');
    }
  };

  return (
    <header style={headerStyles}>
      <nav style={navStyles}>
        <div style={brandStyles}>
          <div>
            <h1 style={titleStyles}>Crime Watch</h1>
            <div style={subtitleStyles}>Stay Safe, Stay Informed</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Link 
            to="/" 
            style={navLinkStyles}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Home
          </Link>
          
          {!user && (
            <>
              <Link 
                to="/login" 
                style={navLinkStyles}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={navLinkStyles}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Register
              </Link>
            </>
          )}
          
          {user && (
            <>
              <Link 
                to="/report" 
                style={{
                  ...navLinkStyles,
                  background: '#3B82F6',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }}
              >
                Report Crime
              </Link>
              
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  aria-expanded={showProfileMenu}
                  aria-haspopup="true"
                  onClick={toggleProfileMenu} 
                  style={{ ...profileToggleStyles, color: '#F3F4F6', font: 'inherit', fontWeight: 600 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#191B20';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>{user.name || 'Profile'}</span>
                </button>
                
                {showProfileMenu && (
                  <div style={profileDropdownStyles}>
                    {logoutError && <p role="alert" style={{ color: '#ef4444', padding: '0.5rem 1rem' }}>{logoutError}</p>}
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