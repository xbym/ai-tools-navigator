import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';

interface CommentFormProps {
  toolId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ toolId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      showToast('请先登录后再评论', 'error');
      return;
    }
    if (content.trim() === '' || rating === 0) {
      showToast('请填写评论内容并选择评分', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, rating })
      });

      if (response.ok) {
        showToast('评论提交成功', 'success');
        setContent('');
        setRating(0);
        onCommentAdded();
      } else {
        const data = await response.json();
        showToast(data.message || '评论提交失败', 'error');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      showToast('评论提交失败,请稍后重试', 'error');
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
        {isSubmitting ? <LoadingSpinner /> : '提交评论'}
      </button>
    </form>
  );
}