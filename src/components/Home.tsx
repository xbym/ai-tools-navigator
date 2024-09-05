'use client';

<<<<<<< HEAD
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();
=======
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { isAuthenticated } = useAuth()
>>>>>>> 35606fa0e13de8545a3679d5a797af92108be371

  return (
    <div>
      <h1>AI工具导航</h1>
      <p>欢迎来到AI工具导航</p>
      {isAuthenticated ? <p>您已登录</p> : <p>请登录以获取更多功能</p>}
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 35606fa0e13de8545a3679d5a797af92108be371
}