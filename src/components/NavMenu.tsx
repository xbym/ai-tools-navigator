import React from 'react';
import Link from 'next/link';

export function NavMenu() {
  return (
    <div className="space-x-4">
      <Link href="/" className="text-gray-300 hover:text-white">
        首页
      </Link>
      <Link href="/admin" className="text-gray-300 hover:text-white">
        管理
      </Link>
    </div>
  );
}