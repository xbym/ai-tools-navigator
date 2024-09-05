'use client';

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import AIToolListWrapper from '@/components/AIToolListWrapper';

export default function Home() {
  return (
    <Layout>
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <AIToolListWrapper />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}