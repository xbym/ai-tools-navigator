import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface SignInFormProps {
  onSuccess: () => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    if (result?.ok) {
      onSuccess();
    } else {
      alert('登录失败');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">登录</h2>
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-800 bg-gray-100"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        登录
      </button>
    </form>
  );
}