import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import AdminRegisterForm from '@/components/AdminRegisterForm'; // 假设你有这个组件

export default function AdminRegister() {
  return (
    <Layout title="管理员注册 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <AdminRegisterForm />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}