"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AITool } from '@/types/AITool';

interface ToolDetailContentProps {
  id: string;
}

export default function ToolDetailContent({ id }: ToolDetailContentProps) {
  const [tool, setTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`/api/tools/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tool not found');
          }
          throw new Error('Failed to fetch tool');
        }
        const data = await response.json();
        setTool(data);
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!tool) {
    return <div className="text-center py-8">Tool not found</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Image
            src={tool.iconUrl}
            alt={tool.name}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">{tool.name}</h1>
        </div>
        <p className="text-gray-600 mb-4">{tool.description}</p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {tool.category.split(',').map((cat) => (
              <span key={cat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {cat.trim()}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span key={tag} className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Visit Tool
        </a>
      </div>
      {tool.screenshotUrl && (
        <div className="mt-6">
          <Image
            src={tool.screenshotUrl}
            alt={`${tool.name} screenshot`}
            width={800}
            height={450}
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}