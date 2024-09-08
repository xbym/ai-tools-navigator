import { useState } from 'react';
import { useAuth } from './useAuth';

export function useCommentActions(toolId: string, onCommentUpdated: () => void) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

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

  const handleReaction = async (commentId: string, reaction: 'like' | 'dislike') => {
    if (!user) {
      alert('请先登录后再进行操作');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reaction })
      });

      if (response.ok) {
        onCommentUpdated();
      } else {
        console.error('Failed to update reaction');
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
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
    handleReport
  };
}