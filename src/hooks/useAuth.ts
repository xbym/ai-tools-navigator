'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/components/AuthProvider';
import { fetchWithProgress } from '@/utils/fetchWithProgress';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, isAuthenticated, setUser } = context;

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateUser = async (userData: { username: string; email: string }) => {
    try {
      const token = localStorage.getItem('token');
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  return {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    updateUser,
  };
}