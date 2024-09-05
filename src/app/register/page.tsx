'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import RegisterContent from '@/components/RegisterContent';

export default function Register() {
  return (
    <Layout title="注册 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <RegisterContent />
      </Suspense>
    </Layout>
  );
}