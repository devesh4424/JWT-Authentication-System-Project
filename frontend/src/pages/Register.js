import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }

    // Clear password feedback when password changes
    if (e.target.name === 'password') {
      setPasswordFeedback(null);
    }
  };

  const handlePasswordBlur = async () => {
    if (formData.password && formData.password.length >= 6) {
      // Note: In a real implementation, you might want to debounce this
      // For now, we'll check on blur
      try {
        // Password feedback will come from the register response
        // This is just a placeholder if you want to check on blur
      } catch (error) {
        console.error('Password check error:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setPasswordFeedback(null);
    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      // Store password feedback if available
      if (result.data?.data?.passwordFeedback) {
        setPasswordFeedback(result.data.data.passwordFeedback);
      }
      navigate('/profile');
    } else {
      if (result.error.errors) {
        const errorObj = {};
        result.error.errors.forEach(err => {
          errorObj[err.param] = err.msg;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: result.error.message || 'Registration failed' });
      }

      // Store password feedback even if registration failed (from ChatGPT)
      if (result.data?.data?.passwordFeedback) {
        setPasswordFeedback(result.data.data.passwordFeedback);
      }
    }

    setLoading(false);
  };

  const getStrengthColor = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'strong':
        return '#28a745';
      case 'moderate':
        return '#ffc107';
      case 'weak':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  return (
    <FormCard
      title="Create Account"
      footer={
        <>
          Already have an account? <Link to="/login">Login here</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        {passwordFeedback && (
          <div className="password-feedback">
            <h4>🤖 AI Password Strength Analysis:</h4>
            <div className="strength-indicator">
              <span style={{ color: getStrengthColor(passwordFeedback.strength) }}>
                Strength: {passwordFeedback.strength?.toUpperCase()}
              </span>
              <span>Score: {passwordFeedback.score}/100</span>
            </div>
            <p><strong>Feedback:</strong> {passwordFeedback.feedback}</p>
            {passwordFeedback.suggestions && passwordFeedback.suggestions.length > 0 && (
              <div>
                <strong>Suggestions:</strong>
                <ul>
                  {passwordFeedback.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

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
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handlePasswordBlur}
            required
            minLength={6}
            placeholder="Enter your password (min 6 characters)"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </FormCard>
  );
};

export default Register;

