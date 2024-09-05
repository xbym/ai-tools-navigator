'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import RegisterForm from '@/components/RegisterForm'; // 假设你有这个组件

export default function Register() {
  return (
    <Layout title="注册 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <RegisterForm />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}