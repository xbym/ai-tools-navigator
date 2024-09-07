'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ImageUpload from './ImageUpload';
import Image from 'next/image';

interface EditProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProfileForm({ onCancel, onSuccess }: EditProfileFormProps) {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateUser({ username, email, avatarUrl });
      onSuccess();
    } catch (error) {
      console.error('更新个人资料失败:', error);
      setError('更新个人资料失败，请重试。');
    }
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300">用户名</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">邮箱</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">头像</label>
        <ImageUpload onUpload={handleAvatarUpload} label="上传头像" />
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={100}
            height={100}
            className="mt-2 rounded-full"
          />
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          取消
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          保存
        </button>
      </div>
    </form>
  );
}