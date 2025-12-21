import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [errorExplanation, setErrorExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setErrorExplanation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorExplanation(null);
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error.message || 'Login failed');
      if (result.error.errorExplanation) {
        setErrorExplanation(result.error.errorExplanation);
      }
    }

    setLoading(false);
  };

  return (
    <FormCard
      title="Login"
      footer={
        <>
          Don't have an account? <Link to="/register">Register here</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            {errorExplanation && (
              <div className="error-explanation">
                <h4>🤖 AI Explanation:</h4>
                <p><strong>What happened:</strong> {errorExplanation.explanation}</p>
                <p><strong>Cause:</strong> {errorExplanation.cause}</p>
                <p><strong>Solution:</strong> {errorExplanation.solution}</p>
                {errorExplanation.prevention && (
                  <p><strong>Prevention:</strong> {errorExplanation.prevention}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </FormCard>
  );
};

export default Login;

