"use client";

import AIToolList from './AIToolList';
import { useState, useEffect } from 'react';
import { AITool } from '../types/AITool';

export default function AIToolListWrapper() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      } else {
        setError('Failed to fetch tools');
      }
    } catch (error) {
      setError('Error fetching tools');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    const matchesTag = selectedTag ? (Array.isArray(tool.tags) && tool.tags.includes(selectedTag)) : true;
    return matchesSearch && matchesCategory && matchesTag;
  });

  const categories = Array.from(new Set(tools.map((tool) => tool.category)));
  const tags = Array.from(new Set(tools.flatMap((tool) => Array.isArray(tool.tags) ? tool.tags : [])));

  if (isLoading) {
    return <div className="text-center py-8 text-blue-400">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="搜索工具..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-grow bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">所有分类</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">所有标签</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <AIToolList tools={filteredTools} />
    </div>
  );
}