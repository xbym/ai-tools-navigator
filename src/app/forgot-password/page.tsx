'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <Layout title="忘记密码 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </Layout>
  );
}