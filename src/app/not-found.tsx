"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import NotFoundContent from '@/components/NotFoundContent';

export default function NotFound() {
  return (
    <Layout title="页面未找到 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <NotFoundContent />
      </Suspense>
    </Layout>
  );
}