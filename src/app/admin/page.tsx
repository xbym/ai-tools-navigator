"use client";

import AdminRoute from '@/components/AdminRoute';
import Layout from '@/components/Layout';

export default function AdminPage() {
  return (
    <AdminRoute>
      <Layout title="管理面板 - AI工具导航">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">管理面板</h1>
          {/* 管理员功能 */}
        </div>
      </Layout>
    </AdminRoute>
  );
}