"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';

export default function SubmitTool() {
  const router = useRouter();
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    tags: [] as string[],
    iconUrl: '',
    screenshotUrl: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setToolData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setToolData(prevData => ({ ...prevData, tags }));
  };

  const handleIconUpload = (url: string) => {
    setToolData(prevData => ({ ...prevData, iconUrl: url }));
  };

  const handleScreenshotUpload = (url: string) => {
    setToolData(prevData => ({ ...prevData, screenshotUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toolData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.message || '提交工具时出错');
      }
    } catch (error) {
      setError('提交工具时出错');
    }
  };

  return (
    <Layout title="提交新工具 - AI工具导航">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">提交新的 AI 工具</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">工具名称</label>
            <input
              type="text"
              id="name"
              name="name"
              value={toolData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">描述</label>
            <textarea
              id="description"
              name="description"
              value={toolData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">类别</label>
            <input
              type="text"
              id="category"
              name="category"
              value={toolData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">网址</label>
            <input
              type="url"
              id="url"
              name="url"
              value={toolData.url}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">标签 (用逗号分隔)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={toolData.tags.join(', ')}
              onChange={handleTagChange}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">图标</label>
            <ImageUpload onUpload={handleIconUpload} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">截图</label>
            <ImageUpload onUpload={handleScreenshotUpload} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            提交工具
          </button>
        </form>
      </div>
    </Layout>
  );
}