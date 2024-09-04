import { Comment } from '../types/AITool';
import { useState } from 'react';

interface CommentsProps {
  comments: Comment[];
  toolId: string;
  isLoggedIn: boolean;
}

export default function Comments({ comments, toolId, isLoggedIn }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setLocalComments([...localComments, addedComment]);
        setNewComment('');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-300">评论</h2>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
            placeholder="添加评论..."
            rows={3}
          />
          <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
            提交评论
          </button>
        </form>
      ) : (
        <p className="mb-4 text-gray-400">请登录后发表评论</p>
      )}
      {localComments.map((comment) => (
        <div key={comment._id} className="bg-gray-700 p-4 rounded mb-4">
          <p className="text-gray-300 text-sm mb-1">用户 {comment.userId} 于 {new Date(comment.createdAt).toLocaleString()} 评论：</p>
          <p className="text-white">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}