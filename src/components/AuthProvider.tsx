'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken } from '@/lib/auth';
import { User } from '@/types/user';

// 定义 AuthContext 的类型
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: () => boolean;  // 确保这行存在
  token: string | null;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// 创建 AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 修改 useAuth 钩子
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const newToken = await refreshToken(storedToken);
          localStorage.setItem('token', newToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { user, token } = await response.json();
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setToken(token);
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      console.error('Update user error:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // 或者使用一个加载指示器组件
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: () => user?.role === 'admin',
    token,
    updateUser, // 添加这一行
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}