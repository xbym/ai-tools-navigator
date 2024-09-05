'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import EditProfileForm from '@/components/EditProfileForm';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <Layout title="个人资料 - AI工具导航">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-white">个人资料</h1>
        {user && (
          <>
            {isEditing ? (
              <EditProfileForm
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">用户名</label>
                  <p className="mt-1 text-lg text-white">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">电子邮件</label>
                  <p className="mt-1 text-lg text-white">{user.email}</p>
                </div>
                <button
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  编辑资料
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}