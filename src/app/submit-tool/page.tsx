"use client";

import { Suspense } from 'react';
import Layout from '@/components/Layout';
import SubmitToolContent from '@/components/SubmitToolContent';

export default function SubmitTool() {
  return (
    <Layout title="提交工具 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <SubmitToolContent />
      </Suspense>
    </Layout>
  );
}