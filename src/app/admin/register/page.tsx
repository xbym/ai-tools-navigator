'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import AdminRegisterContent from '@/components/AdminRegisterContent';

export default function AdminRegister() {
  return (
    <Layout title="管理员注册 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <AdminRegisterContent />
      </Suspense>
    </Layout>
  );
}