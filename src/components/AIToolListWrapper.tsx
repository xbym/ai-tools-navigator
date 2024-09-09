"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';
import AIToolList from './AIToolList';
import { AITool } from '@/types/AITool';

export default function AIToolListWrapper() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [filteredTools, setFilteredTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await apiFetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        setTools(data.tools);
        setFilteredTools(data.tools);
      } catch (err) {
        setError('Error fetching tools');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTools();
  }, []);

  useEffect(() => {
    const filtered = tools.filter((tool) => {
      // 检查 tool 和 tool.name 是否存在
      const matchesSearch = tool && tool.name
        ? tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tool.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        : false;
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
      const matchesTag = selectedTag ? tool.tags?.includes(selectedTag) ?? false : true;

      return matchesSearch && matchesCategory && matchesTag;
    });

    setFilteredTools(filtered);
  }, [tools, searchTerm, selectedCategory, selectedTag]);

  const categories = Array.from(new Set(tools.map((tool) => tool.category)));
  const tags = Array.from(new Set(tools.flatMap((tool) => tool.tags)));

  console.log('Rendering AIToolListWrapper, filteredTools:', filteredTools);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row gap-4">
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