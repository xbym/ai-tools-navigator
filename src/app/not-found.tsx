"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout title="404 - 页面未找到">
      <Suspense fallback={<div>加载中...</div>}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
          <p>抱歉,您请求的页面不存在。</p>
        </div>
      </Suspense>
    </Layout>
  );
}