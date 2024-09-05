import { Suspense } from 'react';
import Layout from '@/components/Layout';
import ClientComponent from '@/components/ClientComponent';
import ResetPasswordForm from '@/components/ResetPasswordForm'; // 假设你有这个组件

export default function ResetPassword() {
  return (
    <Layout title="重置密码 - AI工具导航">
      <Suspense fallback={<div>加载中...</div>}>
        <ClientComponent>
          <ResetPasswordForm />
        </ClientComponent>
      </Suspense>
    </Layout>
  );
}