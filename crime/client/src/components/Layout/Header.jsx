import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <h1 className="site-title">Crime Watch</h1>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          {!user && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
          {user && <Link to="/report" className="nav-link">Report a Crime</Link>}
          {user && (
            <div className="profile-menu">
              <div onClick={toggleProfileMenu} className="profile-toggle">
                <FaUser className="profile-icon" />
                <span>{user.displayName || 'Profile'}</span>
              </div>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <ul className="profile-list">
                    <li className="profile-item">
                      <Link to="/profile" className="profile-link">Show profile</Link>
                    </li>
                    <li className="profile-item" onClick={handleLogout}>Logout</li>
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