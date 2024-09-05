"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ProfileContent from '@/components/ProfileContent';

export default function Profile() {
  return (
    <Layout title="个人资料 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ProfileContent />
      </Suspense>
    </Layout>
  );
}