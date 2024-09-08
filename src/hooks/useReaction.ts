import { useState } from 'react';
import { useAuth } from './useAuth';

export function useReaction(toolId: string, onReactionAdded: (commentId: string, type: 'like' | 'dislike') => void) {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    if (!user || !token) {
      alert('请先登录后再进行操作');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        onReactionAdded(commentId, type);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '操作失败');
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      alert(error instanceof Error ? error.message : '操作失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleReaction,
    isLoading
  };
}