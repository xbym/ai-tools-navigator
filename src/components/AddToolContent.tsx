'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToolContent() {
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    url: '',
    category: '',
    tags: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加提交工具的逻辑
    console.log('提交工具:', toolData);
    // 提交成功后可以重定向到工具列表页面
    // router.push('/tools');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={toolData.name}
        onChange={handleChange}
        placeholder="工具名称"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={toolData.description}
        onChange={handleChange}
        placeholder="工具描述"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        name="url"
        value={toolData.url}
        onChange={handleChange}
        placeholder="工具URL"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="category"
        value={toolData.category}
        onChange={handleChange}
        placeholder="类别"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="tags"
        value={toolData.tags}
        onChange={handleChange}
        placeholder="标签（用逗号分隔）"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        添加工具
      </button>
    </form>
  );
}