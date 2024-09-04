"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AITool } from '../../../../types/AITool';  // 使用相对路径
import { CldUploadWidget } from 'next-cloudinary';

export default function EditToolPage({ params }: { params: { id: string } }) {
  const [toolData, setToolData] = useState<AITool | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchTool() {
      try {
        const response = await fetch(`/api/tools/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setToolData(data);
        } else {
          console.error('Failed to fetch tool');
        }
      } catch (error) {
        console.error('Error fetching tool:', error);
      }
    }

    fetchTool();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setToolData((prev: AITool | null) => prev ? { ...prev, [name]: value } : null);  // 指定 prev 的类型
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolData) return;

    try {
      const response = await fetch(`/api/tools/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...toolData,
          tags: Array.isArray(toolData.tags) ? toolData.tags : toolData.tags.split(',').map((tag: string) => tag.trim())
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        console.error('Failed to update tool');
      }
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  if (!toolData) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">编辑工具</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 复用添加工具页面的表单字段 */}
        {/* ... */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          更新工具
        </button>
      </form>
    </div>
  );
}