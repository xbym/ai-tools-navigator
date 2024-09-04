"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../components/ImageUpload';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setToolData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...toolData,
          tags: toolData.tags.split(',').map(tag => tag.trim()),
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to submit tool');
      }
    } catch (error) {
      console.error('Error submitting tool:', error);
    }
  };

  const handleIconUpload = (url: string) => {
    setToolData(prev => ({ ...prev, iconUrl: url }));
  };

  const handleScreenshotUpload = (url: string) => {
    setToolData(prev => ({ ...prev, screenshotUrl: url }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">提交新工具</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 表单字段与 add-tool 页面相同 */}
        {/* ... */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          提交工具
        </button>
      </form>
    </div>
  );
}