'use client';

import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { useCommentActions } from '@/hooks/useCommentActions';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import Pagination from './Pagination';
import { useAuth } from '@/hooks/useAuth';
import ReplyForm from './ReplyForm';
import { Comment } from '@/types/AITool'; // 确保导入 Comment 类型

interface CommentSectionProps {
  toolId: string;
}

export default function CommentSection({ toolId }: CommentSectionProps) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const {
    comments,
    setComments, // 添加 setComments
    currentPage,
    totalPages,
    sortBy,
    sortOrder,
    searchTerm,
    isLoading,
    error,
    handlePageChange,
    handleSortChange,
    handleSearch,
    fetchComments
  } = useComments({ toolId });

  const handleCommentUpdated = (commentId: string, action: 'like' | 'dislike') => {
    setComments((prevComments: Comment[]) => 
      prevComments.map((comment: Comment) => 
        comment._id === commentId 
          ? { 
              ...comment, 
              likes: action === 'like' ? comment.likes + 1 : comment.likes,
              dislikes: action === 'dislike' ? comment.dislikes + 1 : comment.dislikes,
              userReaction: action
            }
          : comment
      )
    );
  };

  const {
    handleReply,
    handleReaction,
    handleReport
  } = useCommentActions(toolId, () => fetchComments(currentPage));

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">评论</h2>
      {user ? (
        <CommentForm toolId={toolId} onCommentAdded={() => fetchComments(currentPage)} />
      ) : (
        <p className="text-white mb-4">请登录后发表评论</p>
      )}
      <div className="mb-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center">
        <input
          type="text"
          placeholder="搜索评论..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
        />
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded w-full sm:w-auto"
        >
          <option value="createdAt-desc">最新</option>
          <option value="createdAt-asc">最早</option>
          <option value="rating-desc">评分从高到低</option>
          <option value="rating-asc">评分从低到高</option>
        </select>
      </div>
      <CommentList 
        comments={comments} 
        toolId={toolId} 
        onCommentUpdated={handleCommentUpdated}
        onReply={handleReplyClick}
        onReaction={(commentId, type) => {
          handleReaction(commentId, type);
          handleCommentUpdated(commentId, type);
        }}
        onReport={handleReport}
      />
      {replyingTo && (
        <ReplyForm
          commentId={replyingTo}
          toolId={toolId}
          onReplyAdded={() => {
            fetchComments(currentPage);
            setReplyingTo(null);
          }}
          onCancel={() => setReplyingTo(null)}
        />
      )}
      <div className="mt-4 flex justify-center">
        {/* ... 分页按钮 ... */}
      </div>
    </div>
  );
}