import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import SubmitToolForm from '@/components/SubmitToolForm'; // 假设你有这个组件

export default function SubmitTool() {
  return (
    <Layout title="提交工具 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <SubmitToolForm />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}