import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Set up axios defaults
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(`${API_URL}/auth/profile`);
          setUser(response.data.data.user);
        } catch (error) {
          // Token might be expired, try to refresh
          if (refreshToken) {
            try {
              await refreshAccessToken();
            } catch (refreshError) {
              // Refresh failed, clear tokens
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: refreshToken
      });
      
      const newAccessToken = response.data.data.accessToken;
      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      
      return newAccessToken;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
      
      setUser(userData);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Login failed' }
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });

      const { user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
      
      setUser(userData);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Registration failed' }
      };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

