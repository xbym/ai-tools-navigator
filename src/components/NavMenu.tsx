'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function NavMenu() {
  const { data: session } = useSession();

  return (
    <div className="space-x-4">
      <Link href="/" className="text-gray-300 hover:text-white">
        首页
      </Link>
      {session ? (
        <>
          <Link href="/profile" className="text-gray-300 hover:text-white">
            个人资料
          </Link>
          {session.user.role === 'admin' && (
            <Link href="/admin" className="text-gray-300 hover:text-white">
              管理
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="text-gray-300 hover:text-white"
          >
            登出
          </button>
        </>
      ) : (
        <>
          <Link href="/auth/signin" className="text-gray-300 hover:text-white">
            登录
          </Link>
          <Link href="/auth/register" className="text-gray-300 hover:text-white">
            注册
          </Link>
        </>
      )}
    </div>
  );
}