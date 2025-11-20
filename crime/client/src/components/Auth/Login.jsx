import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { FaGoogle, FaFacebook, FaLock, FaEnvelope } from 'react-icons/fa';

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
    background: 'linear-gradient(135deg, #0a0e1a 0%, #1e40af 50%, #2563eb 100%)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundAccentStyles = {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    filter: 'blur(120px)',
    opacity: 0.3,
    pointerEvents: 'none'
  };

  const cardStyles = {
    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.2)',
    width: '100%',
    maxWidth: '480px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(20px)'
  };

  const logoStyles = {
    textAlign: 'center',
    fontSize: '4rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5))'
  };

  const titleStyles = {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
    fontSize: '2.5rem',
    fontWeight: 900,
    letterSpacing: '-0.5px'
  };

  const subtitleStyles = {
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: '2.5rem',
    fontSize: '1rem',
    fontWeight: 500
  };

  const inputGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginBottom: '1.5rem',
    position: 'relative'
  };

  const labelStyles = {
    color: '#cbd5e1',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '0.3px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const inputWrapperStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const iconStyles = {
    position: 'absolute',
    left: '1.2rem',
    color: '#64748b',
    fontSize: '1.1rem',
    zIndex: 1
  };

  const inputStyles = {
    width: '100%',
    padding: '1rem 1.2rem 1rem 3.2rem',
    fontSize: '1rem',
    border: '2px solid #334155',
    borderRadius: '12px',
    background: '#0f172a',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  };

  const buttonStyles = {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#ffffff',
    padding: '1.1rem 1.8rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
    letterSpacing: '0.5px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  };

  const socialButtonStyles = {
    ...buttonStyles,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    fontSize: '1rem',
    marginBottom: '0.8rem'
  };

  const dividerStyles = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '2rem 0',
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: 600
  };

  const dividerLineStyles = {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(to right, transparent, #475569, transparent)'
  };

  const errorStyles = {
    color: '#ffffff',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
    padding: '1rem 1.3rem',
    borderRadius: '12px',
    borderLeft: '4px solid #ef4444',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
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
      setError(err.message.replace('Firebase: ', ''));
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
      setError(err.message.replace('Firebase: ', ''));
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
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyles}>
      <div style={{ ...backgroundAccentStyles, top: '-200px', left: '-200px', background: '#3b82f6' }}></div>
      <div style={{ ...backgroundAccentStyles, bottom: '-200px', right: '-200px', background: '#f59e0b' }}></div>
      
      <div style={cardStyles}>
        <div style={logoStyles}>🚨</div>
        <h2 style={titleStyles}>Welcome Back</h2>
        <p style={subtitleStyles}>Sign in to access Crime Watch</p>
        
        {error && <div style={errorStyles}>⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>
              <FaEnvelope style={{ color: '#3b82f6' }} />
              Email Address
            </label>
            <div style={inputWrapperStyles}>
              <FaEnvelope style={iconStyles} />
              <input 
                style={inputStyles}
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={e => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#334155';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>
          
          <div style={inputGroupStyles}>
            <label style={labelStyles}>
              <FaLock style={{ color: '#3b82f6' }} />
              Password
            </label>
            <div style={inputWrapperStyles}>
              <FaLock style={iconStyles} />
              <input 
                style={inputStyles}
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={e => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#334155';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>
          
          <button 
            style={buttonStyles}
            type="submit" 
            disabled={loading}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
            }}
          >
            {loading ? '🔄 Signing In...' : '🔐 Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
Don&apos;t have an account?
          <Link to="/register" style={{ 
            color: '#3b82f6', 
            textDecoration: 'none', 
            fontWeight: 600,
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.color = '#60a5fa'}
          onMouseLeave={e => e.target.style.color = '#3b82f6'}
          >
            Create Account →
          </Link>
        </div>
        
        <div style={dividerStyles}>
          <div style={dividerLineStyles}></div>
          <span style={{ padding: '0 1rem' }}>OR CONTINUE WITH</span>
          <div style={dividerLineStyles}></div>
        </div>
        
        <button 
          style={{ ...socialButtonStyles, background: 'linear-gradient(135deg, #DB4437, #C1351D)' }}
          onClick={handleGoogleLogin} 
          disabled={loading}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(219, 68, 55, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(219, 68, 55, 0.4)';
          }}
        >
          <FaGoogle /> Continue with Google
        </button>
        
        <button 
          style={{ ...socialButtonStyles, background: 'linear-gradient(135deg, #3B5998, #2D4373)' }}
          onClick={handleFacebookLogin} 
          disabled={loading}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 89, 152, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 89, 152, 0.4)';
          }}
        >
          <FaFacebook /> Continue with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;