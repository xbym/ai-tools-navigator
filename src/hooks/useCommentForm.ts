import { useState } from 'react';
import { useAuth } from './useAuth';

export function useCommentForm(toolId: string, onCommentAdded: () => void) {
  const { user, token } = useAuth();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('评论内容不能为空');
      return;
    }
    if (!token) {
      alert('您需要登录才能发表评论');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, rating }),
      });
      if (response.ok) {
        onCommentAdded();
        setContent('');
        setRating(0);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '评论提交失败');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(error instanceof Error ? error.message : '评论提交失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    content,
    setContent,
    rating,
    setRating,
    isLoading,
    handleSubmit
  };
}