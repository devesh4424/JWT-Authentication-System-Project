import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import FormCard from '../components/FormCard';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/profile');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/admin/users`);
      setUsers(response.data.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      const response = await axios.patch(`${API_URL}/auth/admin/assign-role`, {
        userId,
        role: newRole
      });

      // Update the user in the local state
      setUsers(users.map(u => u._id === userId ? response.data.data : u));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user role');
      console.error('Error updating role:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-container">
        <h1 className="admin-panel-title">Admin Panel</h1>
        <p className="admin-panel-subtitle">Manage Users and Roles</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-users">No users found</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {u._id === user.id ? (
                          <span className="current-user-badge">Current User</span>
                        ) : (
                          <>
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={updatingUserId === u._id}
                              className="role-select"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            {updatingUserId === u._id && (
                              <span className="updating-text">Updating...</span>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-panel-info">
          <p>Total Users: <strong>{users.length}</strong></p>
          <button onClick={fetchUsers} className="refresh-button">
            Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

