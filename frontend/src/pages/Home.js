import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <div className="home-content">
        <h1 className="home-title">Welcome to Auth System</h1>
        <p className="home-subtitle">
          Secure authentication with JWT, MongoDB, and AI-powered assistance
        </p>
        
        {isAuthenticated ? (
          <div className="home-authenticated">
            <p className="home-greeting">Hello, {user?.name}!</p>
            <div className="home-actions">
              <Link to="/profile" className="home-button primary">
                View Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="home-actions">
            <Link to="/register" className="home-button primary">
              Get Started
            </Link>
            <Link to="/login" className="home-button secondary">
              Login
            </Link>
          </div>
        )}

        <div className="home-features">
          <div className="feature">
            <div className="feature-icon">🔐</div>
            <h3>Secure</h3>
            <p>JWT tokens with bcrypt password hashing</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>ChatGPT integration for password strength and error explanations</p>
          </div>
          <div className="feature">
            <div className="feature-icon">👥</div>
            <h3>Role-Based</h3>
            <p>Admin and user role management</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📧</div>
            <h3>Password Reset</h3>
            <p>Secure email-based password recovery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

