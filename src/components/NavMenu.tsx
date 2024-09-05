'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function NavMenu() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link href="/">首页</Link></li>
        <li><Link href="/submit-tool">提交工具</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link href="/admin">管理</Link></li>
            <li><button onClick={logout} className="text-white hover:text-gray-300">注销</button></li>
          </>
        ) : (
          <>
            <li><Link href="/login" className="text-white hover:text-gray-300">登录</Link></li>
            <li><Link href="/register" className="text-white hover:text-gray-300">注册</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}