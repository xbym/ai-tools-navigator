'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegisterForm() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加注册管理员的逻辑
    console.log('注册管理员:', userData);
    // 注册成功后跳转
    router.push('/admin');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={userData.username}
        onChange={handleChange}
        placeholder="用户名"
        required
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        placeholder="邮箱"
        required
      />
      <input
        type="password"
        name="password"
        value={userData.password}
        onChange={handleChange}
        placeholder="密码"
        required
      />
      <button type="submit">注册管理员</button>
    </form>
  );
}