import { useState } from 'react';
import { useAuth } from './useAuth';

export function useCommentActions(toolId: string, onCommentUpdated: () => void) {
  const { user, token } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      alert('回复内容不能为空');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (response.ok) {
        onCommentUpdated();
        setReplyingTo(null);
        setReplyContent('');
      } else {
        console.error('Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

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
        // 不刷新整个评论列表，而是更新特定评论的状态
        onCommentUpdated();
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

  const handleReport = async (commentId: string) => {
    if (!user) {
      alert('请先登录后再进行操作');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('举报成功，我们会尽快处理');
        onCommentUpdated();
      } else {
        console.error('Failed to report comment');
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  return {
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    handleReply,
    handleReaction,
    isLoading,
    handleReport
  };
}