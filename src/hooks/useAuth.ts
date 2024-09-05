'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/components/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, isAuthenticated } = context;

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };
}