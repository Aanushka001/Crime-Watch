import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfile } from '../../utils/api';

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">User Profile</h1>
        
        <div className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Name:</label>
            <div className="profile-value">{user?.displayName || 'N/A'}</div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email:</label>
            <div className="profile-value">{user?.email || 'N/A'}</div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">User ID:</label>
            <div className="profile-value">{user?.uid || 'N/A'}</div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Account Created:</label>
            <div className="profile-value">
              {profileData?.createdAt ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Account Status:</label>
            <div className="profile-value">Active and verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;