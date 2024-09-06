'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function NavMenu() {
  const { isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">AI工具导航</Link>
        <ul className="flex space-x-4 items-center">
          <li><Link href="/" className="hover:text-gray-300">首页</Link></li>
          <li><Link href="/submit-tool" className="hover:text-gray-300">提交工具</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link href="/profile" className="hover:text-gray-300">个人资料</Link></li>
              {isAdmin() && <li><Link href="/admin" className="hover:text-gray-300">管理</Link></li>}
              <li><button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">注销</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">登录</Link></li>
              <li><Link href="/register" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">注册</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}