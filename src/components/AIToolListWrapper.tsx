"use client";

import AIToolList from './AIToolList';
import aiToolsData from '../../data/ai-tools.json';
import { AITool } from '../types/AITool';
import { useState, useMemo } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

const ITEMS_PER_PAGE = 6;

type SortOption = 'name' | 'category';

export default function AIToolListWrapper() {
  const { data: session, status } = useSession();
  const tools: AITool[] = aiToolsData as AITool[];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  const filteredAndSortedTools = useMemo(() => {
    return tools
      .filter(tool => 
        (selectedCategory ? tool.category === selectedCategory : true) &&
        (searchTerm ? tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return a.category.localeCompare(b.category);
        }
      });
  }, [tools, selectedCategory, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedTools.length / ITEMS_PER_PAGE);
  const paginatedTools = filteredAndSortedTools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === "loading") {
    return <div>加载中...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="mb-4 flex justify-end">
        {session ? (
          <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">登出</button>
        ) : (
          <button onClick={() => signIn()} className="bg-blue-500 text-white px-4 py-2 rounded">登录</button>
        )}
      </div>
      <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="搜索AI工具..."
          className="border rounded p-2 w-full sm:w-1/3 bg-white text-gray-800 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="border rounded p-2 w-full sm:w-1/3 bg-white text-gray-800"
          onChange={(e) => {
            setSelectedCategory(e.target.value || null);
            setCurrentPage(1);
          }}
          value={selectedCategory || ''}
        >
          <option value="">所有分类</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          className="border rounded p-2 w-full sm:w-1/3 bg-white text-gray-800"
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          value={sortBy}
        >
          <option value="name">按名称排序</option>
          <option value="category">按类别排序</option>
        </select>
      </div>
      {filteredAndSortedTools.length > 0 ? (
        <>
          <AIToolList tools={paginatedTools} />
          <div className="mt-4 flex justify-center flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded m-1 ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-8 text-gray-500">
          没有找到匹配的AI工具。请尝试其他搜索词或分类。
        </div>
      )}
    </div>
  );
}