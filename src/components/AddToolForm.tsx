'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToolForm() {
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加提交工具的逻辑
    console.log('提交工具:', toolData);
    // 提交成功后跳转
    router.push('/admin');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={toolData.name}
        onChange={handleChange}
        placeholder="工具名称"
        required
      />
      <textarea
        name="description"
        value={toolData.description}
        onChange={handleChange}
        placeholder="工具描述"
        required
      />
      <input
        type="text"
        name="category"
        value={toolData.category}
        onChange={handleChange}
        placeholder="分类"
        required
      />
      <input
        type="url"
        name="url"
        value={toolData.url}
        onChange={handleChange}
        placeholder="工具URL"
        required
      />
      <button type="submit">添加工具</button>
    </form>
  );
}