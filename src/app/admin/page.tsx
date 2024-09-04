"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AITool } from '@/types/AITool';
import Layout from '@/components/Layout';

export default function AdminPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 9;

  useEffect(() => {
    fetchTools();
  }, [currentPage]);

  const fetchTools = async () => {
    try {
      const response = await fetch(`/api/tools?page=${currentPage}&limit=${toolsPerPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      setTools(data.tools);
      setIsLoading(false);
    } catch (error) {
      setError('Error fetching tools. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        const response = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setTools(tools.filter(tool => tool._id !== id));
        } else {
          throw new Error('Failed to delete tool');
        }
      } catch (error) {
        setError('Error deleting tool. Please try again.');
      }
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  return (
    <Layout title="管理员界面 - AI工具导航" description="管理AI工具列表">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">管理员界面</h1>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Link href="/admin/add-tool" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 text-center">
            添加新工具
          </Link>
          <input
            type="text"
            placeholder="搜索工具..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded flex-grow bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool._id} className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-300 mb-2">{tool.name}</h2>
                <p className="text-gray-400 mb-4 line-clamp-3">{tool.description}</p>
                <div className="text-sm text-gray-500 mb-2">
                  访问次数: {tool.viewCount}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
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
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 disabled:bg-gray-400"
          >
            上一页
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={tools.length < toolsPerPage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
          >
            下一页
          </button>
        </div>
      </div>
    </Layout>
  );
}