import { useAuth } from './useAuth';

export function useReport(toolId: string, onReportAdded: () => void) {
  const { user, token } = useAuth();

  const handleReport = async (commentId: string) => {
    if (!user || !token) {
      alert('请先登录后再进行操作');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('举报成功，我们会尽快处理');
        onReportAdded();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '举报失败');
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
      alert(error instanceof Error ? error.message : '举报失败，请稍后再试');
    }
  };

  return {
    handleReport
  };
}