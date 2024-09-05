"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AIToolList from './AIToolList';
import { AITool } from '@/types/AITool';

export default function AIToolListWrapper() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [filteredTools, setFilteredTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        console.log('Fetching tools...');
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        console.log('Fetched tools:', data.tools);
        setTools(data.tools);
        setFilteredTools(data.tools);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError('Error loading tools');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  useEffect(() => {
    const filtered = tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
      const matchesTag = selectedTag ? tool.tags.includes(selectedTag) : true;
      return matchesSearch && matchesCategory && matchesTag;
    });
    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, selectedTag, tools]);

  const categories = Array.from(new Set(tools.map((tool) => tool.category)));
  const tags = Array.from(new Set(tools.flatMap((tool) => tool.tags)));

  console.log('Rendering AIToolListWrapper, filteredTools:', filteredTools);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Suspense fallback={<div>加载搜索参数中...</div>}>
        <SearchParamsHandler />
      </Suspense>
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

function SearchParamsHandler() {
  const searchParams = useSearchParams();
  // 使用 searchParams 进行必要的操作
  return null;
}