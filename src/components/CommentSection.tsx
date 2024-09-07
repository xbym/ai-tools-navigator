'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Comment, Reply } from '@/types/AITool';
import Image from 'next/image';

const CommentForm = lazy(() => import('./CommentForm'));
const EditCommentForm = lazy(() => import('./EditCommentForm'));
const ReplyForm = lazy(() => import('./ReplyForm'));

interface CommentSectionProps {
  toolId: string;
}

export default function CommentSection({ toolId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const { user, token } = useAuth();  // 获取token
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);

  const fetchComments = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      console.log('API response:', JSON.stringify(data, null, 2));
      if (Array.isArray(data.comments)) {
        setComments(data.comments);
      } else {
        console.error('Unexpected comments data structure:', data);
        setComments([]);
      }
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [toolId, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    fetchComments(currentPage);

    // 设置定期刷新
    const intervalId = setInterval(() => {
      fetchComments(currentPage);
    }, 30000); // 每30秒刷新一次

    // 添加页面可见性变化监听
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchComments(currentPage);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchComments, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = event.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const handleEditComment = async (commentId: string, newContent: string, newRating: number) => {
    try {
      const response = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, content: newContent, rating: newRating }),
      });

      if (response.ok) {
        // 更新本地评论状态
        setComments(comments.map(comment => 
          comment._id === commentId ? { ...comment, content: newContent, rating: newRating } : comment
        ));
        setEditingCommentId(null);
      } else {
        // 处理错误
      }
    } catch (error) {
      // 处理错误
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('确定要删除这条评论吗?')) {
      try {
        const response = await fetch(`/api/tools/${toolId}/comments`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId }),
        });

        if (response.ok) {
          // 从本地状态中移除评论
          setComments(comments.filter(comment => comment._id !== commentId));
        } else {
          // 处理错误
        }
      } catch (error) {
        // 处理错误
      }
    }
  };

  const handleCommentAdded = () => {
    fetchComments(1); // 重新加载第一页评论
  };

  const handleReaction = async (commentId: string, reaction: 'like' | 'dislike') => {
    if (!user || !token) {
      alert('请先登录后再进行操作');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reaction`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // 添加认证令牌
        },
        body: JSON.stringify({ reaction }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(comments.map(comment => 
          comment._id === commentId ? { ...comment, ...updatedComment } : comment
        ));
      } else {
        // 处理错误
        console.error('Failed to update reaction');
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleReport = async (commentId: string) => {
    if (!user || !token) {
      alert('请先登录后再举报评论');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert('评论已被举报,管理员会尽快处理');
      } else {
        alert('举报失败,请稍后再试');
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
      alert('举报时发生错误,请稍后再试');
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!user || !token) {
      alert('请先登录后再回复');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setComments(comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        ));
        alert('回复已成功添加');
      } else {
        alert('回复失败,请稍后再试');
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      alert('回复时发生错误,请稍后再试');
    }
  };

  const handleEditReply = async (commentId: string, replyId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reply/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (response.ok) {
        const updatedComments = comments.map(comment => 
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies?.map(reply =>
                  reply._id === replyId ? { ...reply, content: newContent } : reply
                ) ?? []
              }
            : comment
        );
        setComments(updatedComments);
        setEditingReplyId(null);
        alert('回复已更新');
      } else {
        alert('更新回复失败');
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      alert('更新回复时出错');
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (window.confirm('确定要删除这条回复吗?')) {
      try {
        const response = await fetch(`/api/tools/${toolId}/comments/${commentId}/reply/${replyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (response.ok) {
          const updatedComments = comments.map(comment => 
            comment._id === commentId
              ? { ...comment, replies: comment.replies?.filter(reply => reply._id !== replyId) ?? [] }
              : comment
          );
          setComments(updatedComments);
          alert('回复已删除');
        } else {
          alert('删除回复失败');
        }
      } catch (error) {
        console.error('Error deleting reply:', error);
        alert('删除回复时出错');
      }
    }
  };

  useEffect(() => {
    console.log('Current comments:', comments);
  }, [comments]);

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">评论</h2>
      {user ? (
        <Suspense fallback={<div>Loading comment form...</div>}>
          <CommentForm toolId={toolId} onCommentAdded={handleCommentAdded} />
        </Suspense>
      ) : (
        <p className="text-white mb-4">请登录后发表评论</p>
      )}
      <div className="mb-4 mt-6 flex items-center">
        <input
          type="text"
          placeholder="搜索评论..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-gray-700 text-white p-2 rounded mr-2 flex-grow"
        />
        <select
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="createdAt-desc">最新</option>
          <option value="createdAt-asc">最早</option>
          <option value="rating-desc">评分从高到低</option>
          <option value="rating-asc">评分从低到高</option>
        </select>
      </div>
      {isLoading ? (
        <p className="text-white">加载中...</p>
      ) : comments && comments.length > 0 ? (
        <>
          {comments.map((comment) => {
            console.log('Rendering comment:', comment);
            return (
              <div key={comment._id} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <Image
                    src={comment.user?.avatarUrl || '/default-avatar.png'}
                    alt={comment.user?.username || 'Anonymous'}
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                  />
                  <span className="font-bold text-white">{comment.user?.username || 'Anonymous'}</span>
                </div>
                {editingCommentId === comment._id ? (
                  <Suspense fallback={<div>Loading edit form...</div>}>
                    <EditCommentForm
                      initialContent={comment.content}
                      initialRating={comment.rating}
                      onSave={(newContent, newRating) => handleEditComment(comment._id, newContent, newRating)}
                      onCancel={() => setEditingCommentId(null)}
                    />
                  </Suspense>
                ) : (
                  <>
                    <p className="text-white">{comment.content}</p>
                    <p className="text-yellow-400">评分: {comment.rating}</p>
                    <div className="mt-2 flex items-center">
                      <button 
                        onClick={() => handleReaction(comment._id, 'like')}
                        className={`mr-2 ${comment.userReaction === 'like' ? 'text-blue-500' : 'text-gray-400'}`}
                      >
                        👍 {comment.likes}
                      </button>
                      <button 
                        onClick={() => handleReaction(comment._id, 'dislike')}
                        className={`mr-2 ${comment.userReaction === 'dislike' ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        👎 {comment.dislikes}
                      </button>
                    </div>
                    {user && user.id === comment.user.id && (
                      <div className="mt-2">
                        <button onClick={() => setEditingCommentId(comment._id)} className="text-blue-400 mr-2">
                          编辑
                        </button>
                        <button onClick={() => handleDeleteComment(comment._id)} className="text-red-400">
                          删除
                        </button>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        {/* ... 点赞/踩按钮保持不变 */}
                      </div>
                      {user && user.id !== comment.user.id && (
                        <button 
                          onClick={() => handleReport(comment._id)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          举报
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      <h4 className="text-white font-bold">回复:</h4>
                      {comment.replies && comment.replies.length > 0 ? (
                        comment.replies.map((reply: Reply) => (
                          <div key={reply._id} className="ml-4 mt-2 p-2 bg-gray-600 rounded">
                            <div className="flex items-center mb-1">
                              <Image
                                src={reply.avatarUrl || '/default-avatar.png'}
                                alt={reply.username || 'Anonymous'}
                                width={20}
                                height={20}
                                className="rounded-full mr-2"
                              />
                              <span className="text-white font-bold">{reply.username || 'Anonymous'}</span>
                            </div>
                            <p className="text-white">{reply.content}</p>
                            <p className="text-gray-400 text-sm">
                              发表于 {new Date(reply.createdAt).toLocaleString()}
                            </p>
                            {user && (user.id === reply.userId || user.role === 'admin') && (
                              <div>
                                {editingReplyId === reply._id ? (
                                  <ReplyForm
                                    commentId={comment._id}
                                    initialContent={reply.content}
                                    onReply={(commentId, content) => handleEditReply(commentId, reply._id, content)}
                                    onCancel={() => setEditingReplyId(null)}
                                    isEditing={true}
                                  />
                                ) : (
                                  <>
                                    <button onClick={() => setEditingReplyId(reply._id)}>编辑</button>
                                    <button onClick={() => handleDeleteReply(comment._id, reply._id)}>删除</button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">暂无回复</p>
                      )}
                      <Suspense fallback={<div>Loading reply form...</div>}>
                        <ReplyForm commentId={comment._id} onReply={handleReply} />
                      </Suspense>
                    </div>
                  </>
                )}
              </div>
            )
          })}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              上一页
            </button>
            <span className="mx-2 text-white">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              下一页
            </button>
          </div>
        </>
      ) : (
        <p className="text-white">暂无评论</p>
      )}
    </div>
  );
}