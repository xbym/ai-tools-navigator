"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface AITool {
  _id: string;
  name: string;
  category: string;
  averageRating: number;
  viewCount: number;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const { token } = useAuth();

  const fetchTools = useCallback(async () => {
    try {
      const response = await fetch('/api/tools', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return (
    <AdminRoute>
      <Layout title="AI工具管理 - AI工具导航">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">AI工具管理</h1>
          <Link href="/admin/add-tool" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
            添加新工具
          </Link>
          <table className="w-full bg-gray-800 mt-4">
            <thead>
              <tr>
                <th className="p-2 text-left">名称</th>
                <th className="p-2 text-left">分类</th>
                <th className="p-2 text-left">平均评分</th>
                <th className="p-2 text-left">浏览次数</th>
                <th className="p-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool._id}>
                  <td className="p-2">{tool.name}</td>
                  <td className="p-2">{tool.category}</td>
                  <td className="p-2">{tool.averageRating.toFixed(1)}</td>
                  <td className="p-2">{tool.viewCount}</td>
                  <td className="p-2">
                    <Link href={`/admin/edit-tool/${tool._id}`} className="text-blue-400 hover:underline mr-2">
                      编辑
                    </Link>
                    <button className="text-red-400 hover:underline">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </AdminRoute>
  );
}