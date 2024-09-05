'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import AddToolContent from '@/components/AddToolContent';

export default function AddTool() {
  return (
    <Layout title="添加工具 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <AddToolContent />
      </Suspense>
    </Layout>
  );
}