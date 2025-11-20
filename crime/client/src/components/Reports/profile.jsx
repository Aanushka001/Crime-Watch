// FILE: ./client/src/components/Reports/profile.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfile } from '../../utils/api';

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
    padding: '2rem'
  };

  const cardStyles = {
    background: '#1e293b',
    padding: '3rem 2.5rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #475569'
  };

  const titleStyles = {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: '800'
  };

  const inputGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginBottom: '1.5rem'
  };

  const labelStyles = {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem'
  };

  const valueStyles = {
    color: '#e2e8f0',
    fontSize: '1rem',
    padding: '1rem 1.2rem',
    background: '#0f172a',
    border: '2px solid #475569',
    borderRadius: '12px',
    marginTop: '0.3rem',
    fontWeight: '500'
  };

  const loadingStyles = {
    fontSize: '1.5rem',
    color: '#2563eb',
    textAlign: 'center',
    padding: '3rem',
    fontWeight: 600
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const data = await getUserProfile();
          setProfileData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || authLoading) {
    return (
      <div style={containerStyles}>
        <div style={cardStyles}>
          <div style={loadingStyles}>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h1 style={titleStyles}>User Profile</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Name:</label>
            <div style={valueStyles}>{user?.displayName || 'N/A'}</div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Email:</label>
            <div style={valueStyles}>{user?.email || 'N/A'}</div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>User ID:</label>
            <div style={valueStyles}>{user?.uid || 'N/A'}</div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Account Created:</label>
            <div style={valueStyles}>
              {profileData?.createdAt ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Account Status:</label>
            <div style={valueStyles}>Active and verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;