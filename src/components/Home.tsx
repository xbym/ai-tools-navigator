'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>AI工具导航</h1>
      <p>欢迎来到AI工具导航</p>
      {isAuthenticated ? <p>您已登录</p> : <p>请登录以获取更多功能</p>}
    </div>
  );
}