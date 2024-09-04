"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AITool } from '../../types/AITool';

export default function AdminPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTools = useCallback(async () => {
    try {
      const response = await fetch(`/api/tools?page=${currentPage}&limit=10&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools);
        setTotalPages(data.totalPages);
      } else {
        setError('Failed to fetch tools');
      }
    } catch (error) {
      setError('Error fetching tools');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个工具吗？')) {
      try {
        const response = await fetch(`/api/tools/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setTools(tools.filter(tool => tool._id !== id));
        } else {
          console.error('删除工具失败');
        }
      } catch (error) {
        console.error('删除工具时出错:', error);
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
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索工具..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button onClick={() => setCurrentPage(1)} className="bg-blue-500 text-white p-2 rounded">
          搜索
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool._id} className="bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">{tool.name}</h2>
            <p className="text-gray-400 mb-4 h-12 overflow-hidden">{tool.description}</p>
            <div className="text-sm text-gray-500 mb-2">
              访问次数: {tool.viewCount}
            </div>
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