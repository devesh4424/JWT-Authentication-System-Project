import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <FormCard title="User Profile">
      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <label>Name:</label>
            <span>{user?.name}</span>
          </div>
          
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          
          <div className="info-item">
            <label>Role:</label>
            <span className={`role-badge ${user?.role}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="profile-actions">
            <Link to="/admin" className="admin-panel-link">
              Go to Admin Panel
            </Link>
          </div>
        )}
      </div>
    </FormCard>
  );
};

export default Profile;

