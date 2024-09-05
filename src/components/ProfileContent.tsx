'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

export default function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加更新个人资料的逻辑
    console.log('更新个人资料:', profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>个人资料</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          placeholder="用户名"
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="邮箱"
        />
        <button type="submit">更新资料</button>
      </form>
    </div>
  );
}