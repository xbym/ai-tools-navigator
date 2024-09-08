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
  const { user, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('回复内容不能为空');
      return;
    }
    if (!token) {
      alert('您需要登录才能回复');
      return;
    }
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
        onReplyAdded();
        setContent('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '回复提交失败');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert(error instanceof Error ? error.message : '回复提交失败，请稍后再试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入你的回复..."
        className="w-full p-2 bg-gray-700 text-white rounded"
        rows={3}
      />
      <div className="mt-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          提交回复
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
          取消
        </button>
      </div>
    </form>
  );
}