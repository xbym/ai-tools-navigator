'use client';

import { useSearchParams } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default function AdminContent() {
  const searchParams = useSearchParams();
  // 使用 searchParams 的逻辑...

  return <AdminDashboard />;
}