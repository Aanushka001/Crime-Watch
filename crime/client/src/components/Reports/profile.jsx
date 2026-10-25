// FILE: ./client/src/components/Reports/profile.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { assignUserRole, getUserProfile } from '../../utils/api';

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleEmail, setRoleEmail] = useState('');
  const [roleValue, setRoleValue] = useState('moderator');
  const [roleMessage, setRoleMessage] = useState('');
  const [roleError, setRoleError] = useState('');
  const [roleSaving, setRoleSaving] = useState(false);
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
          setProfileData(data.user);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleAssignRole = async (event) => {
    event.preventDefault();
    setRoleMessage('');
    setRoleError('');
    setRoleSaving(true);
    try {
      const result = await assignUserRole(roleEmail, roleValue);
      setRoleMessage(`${result.user.email} is now a ${result.user.role}. They must sign out and sign in again.`);
      setRoleEmail('');
    } catch (requestError) {
      setRoleError(requestError.response?.data?.error || 'Unable to update that account role.');
    } finally {
      setRoleSaving(false);
    }
  };

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
            <div style={valueStyles}>{profileData?.name || user?.name || 'N/A'}</div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Email:</label>
            <div style={valueStyles}>{user?.email || 'N/A'}</div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>User ID:</label>
            <div style={valueStyles}>{user?.id || 'N/A'}</div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Account Created:</label>
            <div style={valueStyles}>
              {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Account Status:</label>
            <div style={valueStyles}>{user?.role || 'citizen'}</div>
          </div>
        </div>

        {user?.role === 'administrator' && (
          <form onSubmit={handleAssignRole} style={{ marginTop: '2rem' }}>
            <h2 style={{ ...labelStyles, fontSize: '1.2rem', marginBottom: '1rem' }}>Assign a trusted role</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
              The account must already exist. Role changes take effect after that user signs in again.
            </p>
            <div style={inputGroupStyles}>
              <label style={labelStyles} htmlFor="role-email">Account email</label>
              <input
                id="role-email"
                type="email"
                required
                value={roleEmail}
                onChange={(event) => setRoleEmail(event.target.value)}
                style={{ ...valueStyles, color: '#ffffff' }}
              />
            </div>
            <div style={inputGroupStyles}>
              <label style={labelStyles} htmlFor="role-value">Role</label>
              <select
                id="role-value"
                value={roleValue}
                onChange={(event) => setRoleValue(event.target.value)}
                style={{ ...valueStyles, color: '#ffffff' }}
              >
                <option value="citizen">citizen</option>
                <option value="moderator">moderator</option>
                <option value="administrator">administrator</option>
              </select>
            </div>
            {roleError && <p role="alert" style={{ color: '#fca5a5' }}>{roleError}</p>}
            {roleMessage && <p role="status" style={{ color: '#86efac' }}>{roleMessage}</p>}
            <button
              type="submit"
              disabled={roleSaving}
              style={{
                ...valueStyles,
                width: '100%',
                cursor: 'pointer',
                background: '#2563eb',
                border: 'none'
              }}
            >
              {roleSaving ? 'Saving…' : 'Update role'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;