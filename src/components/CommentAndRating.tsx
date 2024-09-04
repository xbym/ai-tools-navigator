import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CommentAndRatingProps {
  toolId: string;
  currentRating: number;
}

interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export default function CommentAndRating({ toolId, currentRating }: CommentAndRatingProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchComments();
  }, [toolId, currentPage]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tools/${toolId}/comment?page=${currentPage}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleRating = async (score: number) => {
    if (status !== 'authenticated') {
      alert('请登录后再评分');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/rate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}` // 添加这行
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        const data = await response.json();
        setRating(data.averageRating);
      } else {
        alert('评分失败，请稍后再试');
      }
    } catch (error) {
      console.error('Rating error:', error);
      alert('评分出错，请稍后再试');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('请登录后再评论');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        setComment('');
        fetchComments(); // 重新获取评论以包含新添加的评论
      } else {
        alert('评论失败，请稍后再试');
      }
    } catch (error) {
      console.error('Comment error:', error);
      alert('评论出错，请稍后再试');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">评分和评论</h3>
      <div className="mb-4">
        <p>当前评分: {currentRating.toFixed(1)}</p>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          placeholder="添加评论..."
          rows={3}
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
          提交评论
        </button>
      </form>
      <div>
        <h4 className="text-lg font-semibold mb-2">评论列表</h4>
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-700 p-4 rounded mb-4">
            <p className="text-gray-300 text-sm mb-1">用户 {comment.userId} 于 {new Date(comment.createdAt).toLocaleString()} 评论：</p>
            <p className="text-white">{comment.content}</p>
          </div>
        ))}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}