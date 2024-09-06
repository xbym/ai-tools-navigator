'use client';

import { useContext, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/components/AuthProvider';
import { isTokenExpired, refreshToken } from '@/lib/auth';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        try {
          const newToken = await refreshToken(token);
          localStorage.setItem('token', newToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
          context.logout();
        }
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 5 * 60 * 1000); // 每5分钟检查一次

    return () => clearInterval(intervalId);
  }, [context]);

  return context as AuthContextType;
}