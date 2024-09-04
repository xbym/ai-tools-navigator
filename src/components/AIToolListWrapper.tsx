"use client";

import AIToolList from './AIToolList';
import { useState, useEffect } from 'react';
import { AITool } from '../types/AITool';

export default function AIToolListWrapper() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        setTools(data);
      } catch (err) {
        setError('Error fetching tools. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTools();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <AIToolList tools={tools} />;
}