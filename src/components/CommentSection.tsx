'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Comment } from '@/types/AITool';
import Image from 'next/image';
import EditCommentForm from './EditCommentForm';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  toolId: string;
}

export default function CommentSection({ toolId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const fetchComments = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data.comments);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // 可以在这里添加一些用户友好的错误提示
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [toolId, currentPage, sortBy, sortOrder]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = event.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const handleEditComment = async (commentId: string, newContent: string, newRating: number) => {
    try {
      const response = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, content: newContent, rating: newRating }),
      });

      if (response.ok) {
        // 更新本地评论状态
        setComments(comments.map(comment => 
          comment._id === commentId ? { ...comment, content: newContent, rating: newRating } : comment
        ));
        setEditingCommentId(null);
      } else {
        // 处理错误
      }
    } catch (error) {
      // 处理错误
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('确定要删除这条评论吗?')) {
      try {
        const response = await fetch(`/api/tools/${toolId}/comments`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId }),
        });

        if (response.ok) {
          // 从本地状态中移除评论
          setComments(comments.filter(comment => comment._id !== commentId));
        } else {
          // 处理错误
        }
      } catch (error) {
        // 处理错误
      }
    }
  };

  const handleCommentAdded = () => {
    fetchComments(1); // 重新加载第一页评论
  };

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">评论</h2>
      <CommentForm toolId={toolId} onCommentAdded={handleCommentAdded} />
      <div className="mb-4 mt-6">
        <select
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="createdAt-desc">最新</option>
          <option value="createdAt-asc">最早</option>
          <option value="rating-desc">评分从高到低</option>
          <option value="rating-asc">评分从低到高</option>
        </select>
      </div>
      {isLoading ? (
        <p className="text-white">加载中...</p>
      ) : comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <div key={comment._id} className="mb-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <Image
                  src={comment.user.avatarUrl}
                  alt={comment.user.username}
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
                <span className="font-bold text-white">{comment.user.username}</span>
              </div>
              {editingCommentId === comment._id ? (
                <EditCommentForm
                  initialContent={comment.content}
                  initialRating={comment.rating}
                  onSave={(newContent, newRating) => handleEditComment(comment._id, newContent, newRating)}
                  onCancel={() => setEditingCommentId(null)}
                />
              ) : (
                <>
                  <p className="text-white">{comment.content}</p>
                  <p className="text-yellow-400">评分: {comment.rating}</p>
                  {user && user.id === comment.user.id && (
                    <div className="mt-2">
                      <button onClick={() => setEditingCommentId(comment._id)} className="text-blue-400 mr-2">
                        编辑
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-red-400">
                        删除
                      </button>
                    </div>
                  )}
                </>
              )}
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
      ) : (
        <p className="text-white">暂无评论</p>
      )}
    </div>
  );
}