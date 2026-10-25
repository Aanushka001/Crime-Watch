import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../context/AuthContext';
import { googleLogin, login } from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useContext(AuthContext);
  const navigate = useNavigate();
  // Google sign-in is optional: the button only renders when a client ID is configured.
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const submitSession = async (request) => {
    setError('');
    setLoading(true);
    try {
      setSession(await request);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitSession(login({ email, password }));
  };

  return (
    <section className="auth-container" aria-labelledby="login-heading">
      <h1 className="auth-title" id="login-heading">Welcome Back</h1>
      <p className="auth-subtitle">Sign in to access Crime Watch</p>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-input-group">
          <span>Email address</span>
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="auth-input-group">
          <span>Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="auth-subtitle">
        Don&apos;t have an account? <Link to="/register">Create an account</Link>
      </p>
      {googleClientId && (
        <div className="google-signin">
          <GoogleLogin
            onSuccess={(response) => {
              if (response.credential) submitSession(googleLogin(response.credential));
              else setError('Google did not return a sign-in credential.');
            }}
            onError={() => setError('Google sign-in failed. Please try again.')}
          />
        </div>
      )}
    </section>
  );
};

export default Login;