'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Comment } from '@/types/AITool';

export default function ReportedComments() {
  const [reportedComments, setReportedComments] = useState<Comment[]>([]);
  const { user, token } = useAuth();

  const fetchReportedComments = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/reported-comments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReportedComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching reported comments:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchReportedComments();
  }, [fetchReportedComments]);

  const handleDeleteComment = async (toolId: string, commentId: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setReportedComments(reportedComments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleIgnoreReport = async (toolId: string, commentId: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/ignore-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setReportedComments(reportedComments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error ignoring report:', error);
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div>
      <h1>Reported Comments</h1>
      {reportedComments.map(comment => (
        <div key={comment._id} className="border p-4 mb-4">
          <p>{comment.content}</p>
          <p>Reported by: {(comment as any).reports?.length} users</p>
          <button onClick={() => handleDeleteComment((comment as any).toolId, comment._id)}>Delete</button>
          <button onClick={() => handleIgnoreReport((comment as any).toolId, comment._id)}>Ignore Report</button>
        </div>
      ))}
    </div>
  );
}