'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import ForgotPasswordForm from '@/components/ForgotPasswordForm'; // 假设你有这个组件

export default function ForgotPassword() {
  return (
    <Layout title="忘记密码 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <ForgotPasswordForm />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}