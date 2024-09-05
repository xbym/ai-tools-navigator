'use client';

import React from 'react'; // 添加这行
import { useSearchParams } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default function AdminContent() {
  const searchParams = useSearchParams();
  // 使用 searchParams 的逻辑...

  return <AdminDashboard />;
}