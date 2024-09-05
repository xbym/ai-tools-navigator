"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import AdminContent from '@/components/AdminContent';

export default function Admin() {
  return (
    <Layout title="管理面板 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <AdminContent />
      </Suspense>
    </Layout>
  );
}