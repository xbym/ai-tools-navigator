import { useState } from 'react';
import { useAuth } from './useAuth';

export function useReply(toolId: string, onReplyAdded: () => void) {
  const { user, token } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) {
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (response.ok) {
        onReplyAdded();
        setReplyingTo(null);
        setReplyContent('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '回复提交失败');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      alert(error instanceof Error ? error.message : '回复提交失败，请稍后再试');
    }
  };

  return {
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    handleReply
  };
}