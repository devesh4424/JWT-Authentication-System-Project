import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FormCard from '../components/FormCard';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email
      });

      setMessage(response.data.message || 'Password reset email sent');
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending reset email');
    }

    setLoading(false);
  };

  return (
    <FormCard
      title="Forgot Password"
      footer={
        <>
          Remember your password? <Link to="/login">Login here</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <small className="form-help">
            We'll send you a password reset link
          </small>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </FormCard>
  );
};

export default ForgotPassword;

