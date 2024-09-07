'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import EditProfileForm from '@/components/EditProfileForm';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleEditSuccess = async () => {
    setIsEditing(false);
    // 重新获取用户数据
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to fetch updated user data:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="个人资料 - AI工具导航">
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-white">个人资料</h1>
        {isEditing ? (
          <EditProfileForm
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <div className="space-y-4">
            {user.avatarUrl && (
              <Image
                src={user.avatarUrl}
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            )}
            <p className="text-gray-300">用户名: {user.username}</p>
            <p className="text-gray-300">邮箱: {user.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              编辑资料
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}