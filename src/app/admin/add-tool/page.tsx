import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import AddToolForm from '@/components/AddToolForm'; // 假设你有这个组件

export default function AddTool() {
  return (
    <Layout title="添加工具 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <AddToolForm />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}