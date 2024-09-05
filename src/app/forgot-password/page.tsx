'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ForgotPasswordContent from '@/components/ForgotPasswordContent';

export default function ForgotPassword() {
  return (
    <Layout title="忘记密码 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ForgotPasswordContent />
      </Suspense>
    </Layout>
  );
}