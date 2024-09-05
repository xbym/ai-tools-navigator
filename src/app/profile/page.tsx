'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import EditProfileForm from '@/components/EditProfileForm';

// 定义 User 接口
interface User {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleProfileUpdate = () => {
    // 处理个人资料更新成功的逻辑
    console.log('个人资料更新成功');
  };

  const handleCancel = () => {
    // 处理取消编辑的逻辑
    console.log('取消编辑个人资料');
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <Layout title="个人资料 - AI工具导航">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">个人资料</h1>
        {user && (
          <div>
            <p>用户名: {(user as User).username}</p>
            <p>邮箱: {(user as User).email}</p>
            <EditProfileForm 
              onCancel={handleCancel} 
              onSuccess={handleProfileUpdate}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}