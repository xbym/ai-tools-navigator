'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import LoginContent from '@/components/LoginContent';

export default function Login() {
  return (
    <Layout title="登录 - AI工具导航">
      <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">登录</h1>
        <Suspense fallback={<div>加载中...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </Layout>
  );
}