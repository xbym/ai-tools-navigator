'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/components/AuthProvider';
import { fetchWithProgress } from '@/utils/fetchWithProgress';
import { User } from '@/types/User';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const { user, setUser, isAuthenticated, setIsAuthenticated } = context;

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchWithProgress('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetchWithProgress('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        const token = localStorage.getItem('token'); // 从本地存储获取token
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetchWithProgress('/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
        } else {
          throw new Error('Failed to update user');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        // 可以在这里添加错误处理逻辑,比如显示错误消息
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return { user, isAuthenticated, login, logout, register, isAdmin, updateUser };
}