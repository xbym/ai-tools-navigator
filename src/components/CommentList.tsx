import React from 'react';
import { Comment, Reply } from '@/types/AITool';
import { useCommentActions } from '@/hooks/useCommentActions';

interface CommentListProps {
  comments: Comment[];
  toolId: string;
  onCommentUpdated: () => void;
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
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <img
              src={comment.user.avatarUrl || '/default-avatar.png'}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-bold text-white">{comment.user.username}</span>
          </div>
          <p className="text-white">{comment.content}</p>
          <div className="mt-2 text-sm text-gray-400">
            评分: {comment.rating} | 发布于: {new Date(comment.createdAt).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => onReaction(comment._id, 'like')}
              className={`text-sm ${comment.userReaction === 'like' ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-300`}
            >
              👍 {comment.likes}
            </button>
            <button
              onClick={() => onReaction(comment._id, 'dislike')}
              className={`text-sm ${comment.userReaction === 'dislike' ? 'text-red-500' : 'text-gray-400'} hover:text-red-300`}
            >
              👎 {comment.dislikes}
            </button>
            <button
              onClick={() => onReply(comment._id)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              回复
            </button>
            <button
              onClick={() => onReport(comment._id)}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              举报
            </button>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 space-y-2">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="bg-gray-600 p-2 rounded flex items-center">
                  <img
                    src={reply.avatarUrl || '/default-avatar.png'}
                    alt={reply.username}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <div>
                    <span className="font-bold text-white text-sm">{reply.username}</span>
                    <p className="text-sm text-gray-300">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}