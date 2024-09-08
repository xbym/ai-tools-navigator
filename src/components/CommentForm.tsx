import React from 'react';
import { useCommentForm } from '@/hooks/useCommentForm';

interface CommentFormProps {
  toolId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ toolId, onCommentAdded }: CommentFormProps) {
  const {
    content,
    setContent,
    rating,
    setRating,
    isLoading,
    handleSubmit
  } = useCommentForm(toolId, onCommentAdded);

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入你的评论..."
        className="w-full p-2 bg-gray-700 text-white rounded"
        rows={3}
        disabled={isLoading}
      />
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-300 mb-1">评分</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 bg-gray-700 text-white rounded"
          disabled={isLoading}
        >
          <option value={0}>选择评分</option>
          <option value={1}>1 星</option>
          <option value={2}>2 星</option>
          <option value={3}>3 星</option>
          <option value={4}>4 星</option>
          <option value={5}>5 星</option>
        </select>
      </div>
      <div className="mt-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2" disabled={isLoading}>
          提交评论
        </button>
      </div>
    </form>
  );
}