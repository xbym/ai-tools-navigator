import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ReplyFormProps {
  commentId: string;
  toolId: string;
  onReplyAdded: () => void;
  onCancel: () => void;
}

export default function ReplyForm({ commentId, toolId, onReplyAdded, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      alert('请先登录后再回复');
      return;
    }
    if (!content.trim()) {
      alert('回复内容不能为空');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setContent('');
        onReplyAdded();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '提交回复失败');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert(error instanceof Error ? error.message : '提交回复失败,请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded bg-gray-700 text-white"
        placeholder="输入您的回复..."
      />
      <div className="mt-2 space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isSubmitting ? '提交中...' : '提交回复'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          取消
        </button>
      </div>
    </form>
  );
}