"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default function ResetPassword() {
  return (
    <Layout title="重置密码 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </Layout>
  );
}