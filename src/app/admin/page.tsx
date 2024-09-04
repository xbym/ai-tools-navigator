"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AITool } from '../../types/AITool';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchTools();
    }
  }, [status, router]);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      } else {
        setError('Failed to fetch tools');
      }
    } catch (error) {
      setError('Error fetching tools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        const response = await fetch(`/api/tools/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setTools(tools.filter(tool => tool._id !== id));
        } else {
          setError('Failed to delete tool');
        }
      } catch (error) {
        setError('Error deleting tool');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-blue-400">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">管理员界面</h1>
      <div className="mb-6 space-x-4">
        <Link href="/admin/add-tool" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 inline-block">
          添加新工具
        </Link>
        <Link href="/admin/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 inline-block">
          注册新管理员
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool._id} className="bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">{tool.name}</h2>
            <p className="text-gray-400 mb-4 h-12 overflow-hidden">{tool.description}</p>
            <div className="flex justify-between items-center">
              <Link href={`/admin/edit-tool/${tool._id}`} className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-300">
                编辑
              </Link>
              <button
                onClick={() => handleDelete(tool._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}