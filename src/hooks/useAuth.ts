'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/components/AuthProvider';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      login: async () => {},
      logout: () => {},
      isAuthenticated: false,
      isAdmin: () => false,
      token: null,
      updateUser: async () => {},
    };
  }
  return context;
};