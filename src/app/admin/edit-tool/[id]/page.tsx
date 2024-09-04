"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AITool } from '../../../../types/AITool';
import ImageUpload from '../../../../components/ImageUpload';

export default function EditTool({ params }: { params: { id: string } }) {
  const [tool, setTool] = useState<AITool | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTool();
  }, []);

  const fetchTool = async () => {
    const response = await fetch(`/api/tools/${params.id}`);
    const data = await response.json();
    setTool(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tool) return;

    const response = await fetch(`/api/tools/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tool),
    });

    if (response.ok) {
      router.push('/admin/tools');
    } else {
      // 处理错误
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!tool) return;
    setTool({ ...tool, [e.target.name]: e.target.value });
  };

  const handleIconUpload = (url: string) => {
    if (!tool) return;
    setTool({ ...tool, iconUrl: url });
  };

  const handleScreenshotUpload = (url: string) => {
    if (!tool) return;
    setTool({ ...tool, screenshotUrl: url });
  };

  if (!tool) {
    return <div>加载中...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">编辑 AI 工具</h1>
      
      {/* 现有的表单字段 */}
      {/* ... */}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">图标</label>
        <ImageUpload onUpload={handleIconUpload} />
        {tool.iconUrl && <img src={tool.iconUrl} alt="Tool Icon" className="mt-2 h-16 w-16 object-cover rounded-full" />}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">截图</label>
        <ImageUpload onUpload={handleScreenshotUpload} />
        {tool.screenshotUrl && <img src={tool.screenshotUrl} alt="Tool Screenshot" className="mt-2 w-full object-cover rounded" />}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
        更新工具
      </button>
    </form>
  );
}