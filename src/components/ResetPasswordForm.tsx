import { useState } from 'react';

interface ResetPasswordFormProps {
  onSuccess: () => void;
}

export default function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        alert('重置密码邮件已发送');
        onSuccess();
      } else {
        const data = await response.json();
        alert(data.message || '密码重置请求失败');
      }
    } catch (error) {
      console.error('密码重置错误:', error);
      alert('密码重置过程中出现错误');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">重置密码</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-800 bg-gray-100"
        />
      </div>
      <button type="submit" className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
        发送重置邮件
      </button>
    </form>
  );
}