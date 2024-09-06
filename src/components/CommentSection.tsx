'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
  } | string; // 允许 userId 可能是一个字符串
  content: string;
  rating: number;
  createdAt: string;
}

interface CommentSectionProps {
  toolId: string;
}

export default function CommentSection({ toolId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments(1);
  }, [toolId]);

  const fetchComments = async (page: number) => {
    setIsLoading(true);
    const response = await fetch(`/api/tools/${toolId}/comments?page=${page}&limit=10`);
    if (response.ok) {
      const data = await response.json();
      setComments(data.comments);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('请先登录后再评论');
      return;
    }
    const response = await fetch(`/api/tools/${toolId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment, rating: newRating }),
    });
    if (response.ok) {
      setNewComment('');
      setNewRating(5);
      fetchComments(1); // 重新加载第一页评论
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchComments(newPage);
    }
  };

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">评论</h2>
      {isLoading ? (
        <p className="text-white">加载中...</p>
      ) : (
        <>
          {comments.map((comment) => (
            <div key={comment._id} className="mb-4 p-4 bg-gray-700 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-300">
                  {typeof comment.userId === 'object' && comment.userId.username
                    ? comment.userId.username
                    : '匿名用户'}
                </span>
                <span className="text-yellow-400">评分: {comment.rating}/5</span>
              </div>
              <p className="text-gray-200">{comment.content}</p>
              <span className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              上一页
            </button>
            <span className="mx-2 text-white">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              下一页
            </button>
          </div>
        </>
      )}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded bg-gray-600 text-white border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="写下你的评论..."
            required
          />
          <div className="flex items-center mt-2">
            <label className="mr-2 text-gray-300">评分:</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="p-1 border rounded bg-gray-600 text-white border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            提交评论
          </button>
        </form>
      )}
    </div>
  );
}