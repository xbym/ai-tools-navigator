"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  return (
    <Layout title="管理面板 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <AdminDashboard />
      </Suspense>
    </Layout>
  );
}