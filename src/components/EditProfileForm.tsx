'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ImageUpload from './ImageUpload';
import { User } from '@/types/user';

interface EditProfileFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function EditProfileForm({ onCancel, onSuccess }: EditProfileFormProps) {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ username, avatarUrl } as Partial<User>);
      // 显示成功消息
    } catch (error) {
      // 显示错误消息
    }
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 其他表单字段 */}
      <div>
        <label>头像</label>
        <ImageUpload onUpload={handleAvatarUpload} />
        {avatarUrl && <img src={avatarUrl} alt="User Avatar" className="w-20 h-20 rounded-full" />}
      </div>
      <button type="submit">保存更改</button>
    </form>
  );
}