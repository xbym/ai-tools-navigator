'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import LoginContent from '@/components/LoginContent';

export default function Login() {
  return (
    <Layout title="登录 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <LoginContent />
      </Suspense>
    </Layout>
  );
}