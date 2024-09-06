import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface CommentFormProps {
  toolId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ toolId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();  // 获取token

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      alert('请先登录后再评论');
      return;
    }
    if (rating === 0) {
      alert('请选择评分');
      return;
    }
    if (!content.trim()) {
      alert('评论内容不能为空');
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Submitting comment:', { content, rating, userId: user.id });
      const response = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, rating }),
      });
      if (response.ok) {
        setContent('');
        setRating(0);
        onCommentAdded();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(error instanceof Error ? error.message : '提交评论失败,请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">评论内容</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        ></textarea>
      </div>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-300">评分</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>选择评分</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value} 星</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
      >
        {isSubmitting ? '提交中...' : '提交评论'}
      </button>
    </form>
  );
}