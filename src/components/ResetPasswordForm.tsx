'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { checkPasswordStrength } from '@/utils/passwordUtils';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      showToast('密码不匹配', 'error');
      setIsLoading(false);
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength < 3) {
      showToast('密码强度不足,请选择更强的密码', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const token = new URLSearchParams(window.location.search).get('token');
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        showToast('密码已成功重置。正在跳转到登录页面...', 'success');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await response.json();
        showToast(data.message || '重置密码时出错', 'error');
        if (data.message === '密码重置过于频繁,请稍后再试') {
          // 可以在这里添加一些额外的UI反馈,比如显示剩余等待时间
        }
      }
    } catch (error) {
      showToast('重置密码时出错', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block mb-1 text-gray-300">新密码</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <PasswordStrengthIndicator password={password} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block mb-1 text-gray-300">确认新密码</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
      >
        {isLoading ? <LoadingSpinner /> : '重置密码'}
      </button>
    </form>
  );
}