'use client';

import React, { createContext, useState, useEffect } from 'react';
import { User } from '@/types/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  updateUser: (userData: Partial<User>) => Promise<void>; // 添加这一行
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // 实现登录逻辑
  };

  const logout = () => {
    // 实现登出逻辑
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateUser = async (userData: Partial<User>) => {
    // 实现更新用户信息的逻辑
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}