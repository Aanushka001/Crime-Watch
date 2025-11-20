import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    position: 'relative',
    overflow: 'hidden'
  };

  const cardStyles = {
    background: '#1e293b',
    padding: '3rem 2.5rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #475569',
    position: 'relative',
    zIndex: 1
  };

  const titleStyles = {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-0.5px'
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
    fontSize: '0.95rem',
    letterSpacing: '0.3px'
  };

  const inputStyles = {
    padding: '1rem 1.2rem',
    border: '2px solid #475569',
    borderRadius: '12px',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
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
    letterSpacing: '0.5px',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      setUser(userCredential.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, new FacebookAuthProvider());
      setUser(userCredential.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h2 style={titleStyles}>Welcome Back</h2>
        {error && <div style={errorStyles}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={inputGroupStyles}>
            <label style={labelStyles} htmlFor="email">Email</label>
            <input 
              style={inputStyles}
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={inputGroupStyles}>
            <label style={labelStyles} htmlFor="password">Password</label>
            <input 
              style={inputStyles}
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
          Do not have an account?&nbsp;
          <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
            Create Account
          </Link>
        </div>
        <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#94a3b8' }}>
          OR
        </div>
        <button 
          style={{ ...buttonStyles, backgroundColor: '#DB4437', marginBottom: '0.75rem' }} 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          Continue with Google
        </button>
        <button 
          style={{ ...buttonStyles, backgroundColor: '#3B5998' }} 
          onClick={handleFacebookLogin} 
          disabled={loading}
        >
          Continue with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;