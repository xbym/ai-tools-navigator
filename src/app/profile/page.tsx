import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import ProfileContent from '@/components/ProfileContent'; // 假设你有这个组件

export default function Profile() {
  return (
    <Layout title="个人资料 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <ProfileContent />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}