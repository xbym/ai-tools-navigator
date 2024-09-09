"use client";

import { useState, useEffect, useCallback } from 'react';
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

  const fetchTools = useCallback(async () => {
    try {
      const response = await fetch('/api/tools');
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (Array.isArray(data.tools)) {
        setTools(data.tools);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      setError('Failed to fetch tools. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  useEffect(() => {
    const filtered = tools.filter((tool) => {
      const matchesSearch = 
        (tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
      const matchesTag = selectedTag ? tool.tags?.includes(selectedTag) ?? false : true;

      return matchesSearch && matchesCategory && matchesTag;
    });

    setFilteredTools(filtered);
  }, [tools, searchTerm, selectedCategory, selectedTag]);

  const categories = Array.from(new Set(tools.map((tool) => tool.category).filter(Boolean)));
  const tags = Array.from(new Set(tools.flatMap((tool) => tool.tags || []).filter(Boolean)));

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