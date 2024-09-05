'use client';

import { useState } from 'react';
import { isValidEmail } from '@/utils/validationUtils';
import LoadingSpinner from './LoadingSpinner';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isValidEmail(email)) {
      setError('请输入有效的电子邮件地址');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('如果该邮箱存在,我们已发送密码重置链接。请检查您的邮箱。');
      } else {
        const data = await response.json();
        setError(data.message || '发送重置链接时出错');
      }
    } catch (error) {
      setError('发送重置链接时出错');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <div>
        <label htmlFor="email" className="block mb-1 text-gray-300">电子邮件</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
      >
        {isLoading ? <LoadingSpinner /> : '发送重置链接'}
      </button>
    </form>
  );
}