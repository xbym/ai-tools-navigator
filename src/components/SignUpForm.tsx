import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface SignUpFormProps {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (response.ok) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (result?.ok) {
          onSuccess();
        } else {
          alert('注册成功但登录失败');
        }
      } else {
        const data = await response.json();
        alert(data.message || '注册失败');
      }
    } catch (error) {
      console.error('注册错误:', error);
      alert('注册过程中出现错误');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">注册</h2>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-800 bg-gray-100"
        />
      </div>
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-800 bg-gray-100"
        />
      </div>
      <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        注册
      </button>
    </form>
  );
}