'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  return (
    <Layout title="AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <HomeContent />
      </Suspense>
    </Layout>
  );
}