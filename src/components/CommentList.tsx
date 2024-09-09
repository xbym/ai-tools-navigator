import React from 'react';
import { Comment } from '@/types/AITool';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

interface CommentListProps {
  comments: Comment[];
  toolId: string;
  onCommentUpdated: (commentId: string, action: 'like' | 'dislike') => void;
  onReply: (commentId: string) => void;
  onReaction: (commentId: string, type: 'like' | 'dislike') => void;
  onReport: (commentId: string) => void;
}

export default function CommentList({ 
  comments, 
  toolId, 
  onCommentUpdated,
  onReply,
  onReaction,
  onReport
}: CommentListProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-700 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Image
              src={comment.user.avatarUrl || '/default-avatar.png'}
              alt={comment.user.username}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-bold text-white text-sm sm:text-base">{comment.user.username}</span>
          </div>
          <p className="text-white text-sm sm:text-base">{comment.content}</p>
          <div className="mt-2 text-xs sm:text-sm text-gray-400">
            评分: {comment.rating} | 发布于: {new Date(comment.createdAt).toLocaleString()}
          </div>
          <div className="mt-2 flex flex-wrap items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => onReaction(comment._id, 'like')}
              className={`text-xs sm:text-sm ${comment.userReaction === 'like' ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-300`}
              disabled={!user}
            >
              👍 {comment.likes}
            </button>
            <button
              onClick={() => onReaction(comment._id, 'dislike')}
              className={`text-xs sm:text-sm ${comment.userReaction === 'dislike' ? 'text-red-500' : 'text-gray-400'} hover:text-red-300`}
              disabled={!user}
            >
              👎 {comment.dislikes}
            </button>
            <button
              onClick={() => onReply(comment._id)}
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
            >
              回复
            </button>
            <button
              onClick={() => onReport(comment._id)}
              className="text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm"
            >
              举报
            </button>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l border-gray-600">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="mb-2">
                  <div className="flex items-center">
                    <img
                      src={reply.avatarUrl || '/default-avatar.png'}
                      alt={reply.username}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="font-bold text-white text-xs sm:text-sm">{reply.username}</span>
                  </div>
                  <p className="text-white text-xs sm:text-sm mt-1">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}