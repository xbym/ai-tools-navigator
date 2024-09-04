"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

export default function AddToolPage() {
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
        router.push('/admin');
      } else {
        console.error('Failed to add tool');
      }
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">添加新工具</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">名称</label>
          <input
            type="text"
            id="name"
            name="name"
            value={toolData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">描述</label>
          <textarea
            id="description"
            name="description"
            value={toolData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">类别</label>
          <input
            type="text"
            id="category"
            name="category"
            value={toolData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="url" className="block mb-1">URL</label>
          <input
            type="url"
            id="url"
            name="url"
            value={toolData.url}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block mb-1">标签（用逗号分隔）</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={toolData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="iconUrl" className="block mb-1">图标 URL</label>
          <CldUploadWidget
            uploadPreset="ai_tools"
            onUpload={(result: any) => {
              setToolData(prev => ({ ...prev, iconUrl: result.info.secure_url }));
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded">
                上传图标
              </button>
            )}
          </CldUploadWidget>
          {toolData.iconUrl && <img src={toolData.iconUrl} alt="Icon preview" className="mt-2 w-16 h-16" />}
        </div>
        <div>
          <label htmlFor="screenshotUrl" className="block mb-1">截图 URL</label>
          <CldUploadWidget
            uploadPreset="ai_tools"
            onUpload={(result: any) => {
              setToolData(prev => ({ ...prev, screenshotUrl: result.info.secure_url }));
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded">
                上传截图
              </button>
            )}
          </CldUploadWidget>
          {toolData.screenshotUrl && <img src={toolData.screenshotUrl} alt="Screenshot preview" className="mt-2 w-64" />}
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          添加工具
        </button>
      </form>
    </div>
  );
}