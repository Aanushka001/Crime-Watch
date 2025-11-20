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
    background: 'linear-gradient(135deg, #1e40af 0%, #1e293b 100%)',
    color: '#ffffff',
    padding: '1rem 2rem',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    borderBottom: '2px solid #2563eb'
  };

  const navStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const titleStyles = {
    margin: 0,
    fontSize: '1.8rem',
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    letterSpacing: '-0.5px'
  };

  const navLinkStyles = {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    position: 'relative'
  };

  const profileToggleStyles = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    background: 'rgba(37, 99, 235, 0.1)',
    border: '1px solid transparent'
  };

  const profileDropdownStyles = {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    background: '#1e293b',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    borderRadius: '12px',
    zIndex: 1000,
    minWidth: '220px',
    border: '1px solid #475569',
    overflow: 'hidden'
  };

  const profileListStyles = {
    listStyleType: 'none',
    padding: '0.5rem 0',
    margin: 0
  };

  const profileItemStyles = {
    padding: '0.8rem 1.2rem',
    cursor: 'pointer',
    color: '#e2e8f0',
    transition: 'all 0.2s ease',
    fontWeight: '500'
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
      console.error(error);
    }
  };

  return (
    <header style={headerStyles}>
      <nav style={navStyles}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={titleStyles}>Crime Watch</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" style={navLinkStyles}>Home</Link>
          {!user && (
            <>
              <Link to="/login" style={navLinkStyles}>Login</Link>
              <Link to="/register" style={navLinkStyles}>Register</Link>
            </>
          )}
          {user && <Link to="/report" style={navLinkStyles}>Report a Crime</Link>}
          {user && (
            <div style={{ position: 'relative' }}>
              <div onClick={toggleProfileMenu} style={profileToggleStyles}>
                <FaUser style={{ fontSize: '1.2rem', color: '#2563eb' }} />
                <span>{user.displayName || 'Profile'}</span>
              </div>
              {showProfileMenu && (
                <div style={profileDropdownStyles}>
                  <ul style={profileListStyles}>
                    <li style={profileItemStyles}>
                      <Link to="/profile" style={{ ...profileItemStyles, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        Show profile
                      </Link>
                    </li>
                    <li 
                      style={profileItemStyles} 
                      onClick={handleLogout}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(37, 99, 235, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;