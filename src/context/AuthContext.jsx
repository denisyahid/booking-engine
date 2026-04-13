'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { user, token } = response.data.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return response.data;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    const { user, token } = response.data.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore logout API errors
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
