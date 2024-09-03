import { Comment } from '../types/AITool';
import { useState } from 'react';

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isLoggedIn: boolean;
}

export default function Comments({ comments, onAddComment, isLoggedIn }: CommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">评论</h2>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="添加评论..."
            rows={3}
          />
          <button type="submit" className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
            提交评论
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-4">登录后可以添加评论</p>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-4 rounded mb-2">
          <p className="text-gray-600 text-sm mb-1">用户 {comment.userId} 于 {new Date(comment.createdAt).toLocaleString()} 评论：</p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}