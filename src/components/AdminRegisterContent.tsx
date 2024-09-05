'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegisterContent() {
  const [adminData, setAdminData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加注册管理员的逻辑
    console.log('注册管理员:', adminData);
    // 注册成功后可以重定向到管理员面板
    // router.push('/admin');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        value={adminData.username}
        onChange={handleChange}
        placeholder="用户名"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        value={adminData.email}
        onChange={handleChange}
        placeholder="电子邮件"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        value={adminData.password}
        onChange={handleChange}
        placeholder="密码"
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        注册管理员
      </button>
    </form>
  );
}