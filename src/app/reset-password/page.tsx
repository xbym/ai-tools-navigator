import Layout from '@/components/Layout';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default function ResetPassword() {
  return (
    <Layout title="重置密码 - AI工具导航">
      <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-white">重置密码</h1>
        <ResetPasswordForm />
      </div>
    </Layout>
  );
}