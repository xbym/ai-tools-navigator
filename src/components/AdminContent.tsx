'use client';

<<<<<<< HEAD
import React from 'react'; // 添加这行
=======
>>>>>>> 8deb8ac4eedb68b765c04c7773d30ee72ae62ee4
import { useSearchParams } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default function AdminContent() {
  const searchParams = useSearchParams();
  // 使用 searchParams 的逻辑...

  return <AdminDashboard />;
}