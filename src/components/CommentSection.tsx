'use client';

import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { useCommentActions } from '@/hooks/useCommentActions';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import Pagination from './Pagination';
import { useAuth } from '@/hooks/useAuth';
import ReplyForm from './ReplyForm';

interface CommentSectionProps {
  toolId: string;
}

export default function CommentSection({ toolId }: CommentSectionProps) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const {
    comments,
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

  const {
    handleReply,
    handleReaction,
    handleReport
  } = useCommentActions(toolId, () => fetchComments(currentPage));

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">评论</h2>
      {user ? (
        <CommentForm toolId={toolId} onCommentAdded={() => fetchComments(currentPage)} />
      ) : (
        <p className="text-white mb-4">请登录后发表评论</p>
      )}
      <div className="mb-4 mt-6 flex items-center">
        <input
          type="text"
          placeholder="搜索评论..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded mr-2 flex-grow"
        />
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded"
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
        onCommentUpdated={() => fetchComments(currentPage)}
        onReply={(commentId) => setReplyingTo(commentId)}
        onReaction={handleReaction}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}