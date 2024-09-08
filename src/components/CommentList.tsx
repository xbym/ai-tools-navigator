import React, { useState } from 'react';
import { Comment, Reply } from '@/types/AITool';
import { useAuth } from '@/hooks/useAuth';

interface CommentListProps {
  comments: Comment[];
  toolId: string;
  onCommentUpdated: () => void;
}

export default function CommentList({ comments, toolId, onCommentUpdated }: CommentListProps) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      alert('回复内容不能为空');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (response.ok) {
        onCommentUpdated();
        setReplyingTo(null);
        setReplyContent('');
      } else {
        console.error('Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleReaction = async (commentId: string, reaction: 'like' | 'dislike') => {
    if (!user) {
      alert('请先登录后再进行操作');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reaction })
      });

      if (response.ok) {
        onCommentUpdated();
      } else {
        console.error('Failed to update reaction');
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleReport = async (commentId: string) => {
    if (!user) {
      alert('请先登录后再进行操作');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('举报成功，我们会尽快处理');
        onCommentUpdated();
      } else {
        console.error('Failed to report comment');
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  const renderReplies = (replies: Reply[]) => {
    return replies.map((reply) => (
      <div key={reply._id} className="ml-8 mt-2 bg-gray-600 p-3 rounded">
        <div className="flex items-center mb-1">
          <img
            src={reply.avatarUrl || '/default-avatar.png'}
            alt={reply.username}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="font-semibold text-white text-sm">{reply.username}</span>
        </div>
        <p className="text-white text-sm">{reply.content}</p>
        <div className="text-xs text-gray-400 mt-1">
          回复于: {new Date(reply.createdAt).toLocaleString()}
        </div>
      </div>
    ));
  };

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
              onClick={() => handleReaction(comment._id, 'like')}
              className={`text-sm ${comment.userReaction === 'like' ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-300`}
            >
              👍 {comment.likes}
            </button>
            <button
              onClick={() => handleReaction(comment._id, 'dislike')}
              className={`text-sm ${comment.userReaction === 'dislike' ? 'text-red-500' : 'text-gray-400'} hover:text-red-300`}
            >
              👎 {comment.dislikes}
            </button>
            <button
              onClick={() => setReplyingTo(comment._id)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              回复
            </button>
            <button
              onClick={() => handleReport(comment._id)}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              举报
            </button>
          </div>
          {replyingTo === comment._id && (
            <div className="mt-2">
              <textarea
                className="w-full p-2 bg-gray-600 text-white rounded"
                placeholder="输入你的回复..."
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button
                onClick={() => handleReply(comment._id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                提交回复
              </button>
            </div>
          )}
          {renderReplies(comment.replies)}
        </div>
      ))}
    </div>
  );
}