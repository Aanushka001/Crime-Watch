// FILE: ./client/src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
    padding: '2rem',
    position: 'relative'
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
    marginBottom: '0.5rem',
    fontSize: '2.5rem',
    fontWeight: '800'
  };

  const subtitleStyles = {
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: '2.5rem',
    fontSize: '1rem'
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

  const inputStyles = {
    padding: '1rem 1.2rem',
    border: '2px solid #475569',
    borderRadius: '12px',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.2s ease'
  };

  const buttonStyles = {
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#ffffff',
    padding: '1rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    width: '100%'
  };

  const errorStyles = {
    color: '#ffffff',
    background: 'rgba(239, 68, 68, 0.15)',
    padding: '1rem 1.2rem',
    borderRadius: '12px',
    borderLeft: '4px solid #ef4444',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '1.5rem'
  };

  const successStyles = {
    color: '#ffffff',
    background: 'rgba(16, 185, 129, 0.15)',
    padding: '1rem 1.2rem',
    borderRadius: '12px',
    borderLeft: '4px solid #10b981',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '1.5rem'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      setUser(userCredential.user);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Email already registered. Please sign in or use another email.');
      else if (err.code === 'auth/weak-password') setError('Password is too weak. Please use a stronger password.');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address format.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h1 style={titleStyles}>Create Account</h1>
        <p style={subtitleStyles}>Join Crime Watch today</p>
        {error && <div style={errorStyles}>{error}</div>}
        {success && <div style={successStyles}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Username</label>
            <input 
              style={inputStyles} 
              type="text" 
              placeholder="Choose a username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Email Address</label>
            <input 
              style={inputStyles} 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Password</label>
            <input 
              style={inputStyles} 
              type="password" 
              placeholder="Create a password" 
              minLength="6" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Must be at least 6 characters
            </span>
          </div>
          <button 
            style={{ 
              ...buttonStyles, 
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
          Already have an account?&nbsp;
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;