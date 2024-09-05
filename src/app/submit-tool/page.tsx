"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';

export default function SubmitToolPage() {
  const router = useRouter();
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    tags: '',
    iconUrl: '',
    screenshotUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value });
  };

  const handleIconUpload = (url: string) => {
    setToolData({ ...toolData, iconUrl: url });
  };

  const handleScreenshotUpload = (url: string) => {
    setToolData({ ...toolData, screenshotUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...toolData,
          tags: toolData.tags.split(',').map(tag => tag.trim()),
        }),
      });
      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to submit tool');
      }
    } catch (error) {
      console.error('Error submitting tool:', error);
      // 这里可以添加错误处理逻辑，比如显示错误消息给用户
    }
  };

  return (
    <Layout title="提交新工具 - AI工具导航" description="提交新的AI工具到我们的导航网站">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">提交新工具</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">工具名称</label>
            <input
              type="text"
              id="name"
              name="name"
              value={toolData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">分类</label>
            <select
              id="category"
              name="category"
              value={toolData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">选择分类</option>
              <option value="文本生成">文本生成</option>
              <option value="图像生成">图像生成</option>
              <option value="音频处理">音频处理</option>
              <option value="视频编辑">视频编辑</option>
              <option value="数据分析">数据分析</option>
              <option value="其他">其他</option>
            </select>
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">标签（用逗号分隔）</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={toolData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">图标</label>
            <ImageUpload onUpload={handleIconUpload} />
            {toolData.iconUrl && (
              <img src={toolData.iconUrl} alt="Tool Icon" className="mt-2 h-16 w-16 object-cover rounded-full" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">截图</label>
            <ImageUpload onUpload={handleScreenshotUpload} />
            {toolData.screenshotUrl && (
              <img src={toolData.screenshotUrl} alt="Tool Screenshot" className="mt-2 w-full object-cover rounded" />
            )}
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
              提交工具
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}