import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types/AITool';

interface UseCommentsProps {
  toolId: string;
  initialPage?: number;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
}

export function useComments({ toolId, initialPage = 1, initialSortBy = 'createdAt', initialSortOrder = 'desc' }: UseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tools/${toolId}/comments?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Error fetching comments');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [toolId, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    fetchComments(currentPage);

    const intervalId = setInterval(() => {
      fetchComments(currentPage);
    }, 30000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchComments(currentPage);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
    setSortOrder(newSortOrder as 'asc' | 'desc');
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return {
    comments,
    currentPage,
    totalPages,
    sortBy,
    sortOrder,
    searchTerm,
    isLoading,
    error,
    handlePageChange,
    handleSortChange,
    handleSearch,
    fetchComments
  };
}