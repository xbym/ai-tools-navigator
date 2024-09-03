"use client";

import AIToolList from './AIToolList';
import aiToolsData from '../../data/ai-tools.json';
import { AITool } from '../types/AITool';
import { useState, useMemo } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Modal from './Modal';
import SignInForm from './SignInForm'; // 我们稍后会创建这个组件
import SignUpForm from './SignUpForm';
import ResetPasswordForm from './ResetPasswordForm';

const ITEMS_PER_PAGE = 6;

type SortOption = 'name' | 'category';

export default function AIToolListWrapper() {
  const { data: session } = useSession();
  const tools: AITool[] = aiToolsData as AITool[];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = Array.from(new Set(tools.map(tool => tool.category)));
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach(tool => tool.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [tools]);

  const filteredAndSortedTools = useMemo(() => {
    return tools
      .filter(tool => 
        (selectedCategory ? tool.category === selectedCategory : true) &&
        (searchTerm ? tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
        (selectedTags.length > 0 ? selectedTags.every(tag => tool.tags.includes(tag)) : true)
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return a.category.localeCompare(b.category);
        }
      });
  }, [tools, selectedCategory, searchTerm, sortBy, selectedTags]);

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
      <div className="mb-4 flex justify-end space-x-2">
        {session ? (
          <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">登出</button>
        ) : (
          <>
            <button onClick={() => setIsSignInModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">登录</button>
            <button onClick={() => setIsSignUpModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">注册</button>
            <button onClick={() => setIsResetPasswordModalOpen(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">忘记密码</button>
          </>
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">标签筛选:</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTags(prev => 
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
              )}
              className={`px-2 py-1 rounded text-sm ${
                selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
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
      <Modal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)}>
        <SignInForm onSuccess={() => setIsSignInModalOpen(false)} />
      </Modal>
      <Modal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)}>
        <SignUpForm onSuccess={() => setIsSignUpModalOpen(false)} />
      </Modal>
      <Modal isOpen={isResetPasswordModalOpen} onClose={() => setIsResetPasswordModalOpen(false)}>
        <ResetPasswordForm onSuccess={() => setIsResetPasswordModalOpen(false)} />
      </Modal>
    </div>
  );
}