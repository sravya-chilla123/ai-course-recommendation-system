import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current token session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/users/profile');
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or server not ready:', err.message);
        // If profile fetch fails, check if we have stored user in localStorage as backup
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, token: authToken } = response.data.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setToken(authToken);
      setUser(loggedInUser);

      return { success: true, user: loggedInUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user: registeredUser, token: authToken } = response.data.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setToken(authToken);
      setUser(registeredUser);

      return { success: true, user: registeredUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      if (response.data.success) {
        const updated = response.data.data;
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        return { success: true, user: updated };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
    } catch (e) {
      // quiet fail
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
