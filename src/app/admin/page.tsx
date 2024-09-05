"use client";

import { Suspense } from 'react';
import AdminContent from '@/components/AdminContent';
import Layout from '@/components/Layout';

export default function AdminPage() {
  return (
    <Layout title="管理面板 - AI工具导航">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">管理面板</h1>
        <Suspense fallback={<div>加载中...</div>}>
          <AdminContent />
        </Suspense>
      </div>
    </Layout>
  );
}