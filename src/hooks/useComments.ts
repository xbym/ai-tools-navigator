import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types/AITool';

interface UseCommentsProps {
  toolId: string;
}

export function useComments({ toolId }: UseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [toolId, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    fetchComments(currentPage);
  }, [fetchComments, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
    setComments,
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