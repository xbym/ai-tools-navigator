'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function NavMenu() {
  const { isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <nav className="flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-white">AI工具导航</Link>
      <ul className="flex space-x-4">
        <li><Link href="/" className="text-white hover:text-gray-300">首页</Link></li>
        <li><Link href="/submit-tool" className="text-white hover:text-gray-300">提交工具</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link href="/profile" className="text-white hover:text-gray-300">个人资料</Link></li>
            {isAdmin() && <li><Link href="/admin" className="text-white hover:text-gray-300">管理</Link></li>}
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