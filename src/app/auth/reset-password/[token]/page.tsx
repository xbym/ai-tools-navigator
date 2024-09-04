'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => router.push('/auth/signin'), 3000);
      } else {
        setError(data.message || '重置密码失败');
      }
    } catch (error) {
      setError('重置密码过程中出现错误');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">重置密码</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">新密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">确认新密码</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
          重置密码
        </button>
      </form>
    </div>
  );
}