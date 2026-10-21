import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      setSession(await register({ name, email, password }));
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create the account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container" aria-labelledby="register-heading">
      <h1 className="auth-title" id="register-heading">Create Account</h1>
      <p className="auth-subtitle">Join Crime Watch today</p>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-input-group">
          <span>Name</span>
          <input type="text" autoComplete="name" minLength="2" maxLength="80" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="auth-input-group">
          <span>Email address</span>
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="auth-input-group">
          <span>Password</span>
          <input type="password" autoComplete="new-password" minLength="10" maxLength="128" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <small className="auth-hint">Use at least 10 characters.</small>
        </label>
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="auth-subtitle">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
};

export default Register;
