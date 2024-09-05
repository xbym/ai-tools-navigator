'use client';

import { useState, useEffect } from 'react';
import AIToolList from './AIToolList';

export default function HomeContent() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('/api/tools');
        if (response.ok) {
          const data = await response.json();
          setTools(data.tools);
        } else {
          console.error('Failed to fetch tools');
        }
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">AI工具导航</h1>
      <AIToolList tools={tools} />
    </div>
  );
}