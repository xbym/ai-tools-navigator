"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { AITool } from '../../../types/AITool';
import Comments from '../../../components/Comments';

export default function ToolDetail({ params }: { params: { id: string } }) {
  const [tool, setTool] = useState<AITool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    fetchTool();
  }, [params.id]);

  const fetchTool = async () => {
    try {
      const response = await fetch(`/api/tools/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTool(data);
      } else {
        setError('Failed to fetch tool');
      }
    } catch (error) {
      setError('Error fetching tool');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-blue-400">加载中...</div>;
  }

  if (error || !tool) {
    return <div className="text-center py-8 text-red-400">{error || '工具不存在'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Image
            src={tool.iconUrl}
            alt={tool.name}
            width={80}
            height={80}
            className="rounded-full mr-4"
          />
          <h1 className="text-3xl font-bold text-blue-400">{tool.name}</h1>
        </div>
        <p className="text-gray-300 mb-4">{tool.description}</p>
        {tool.screenshotUrl && (
          <Image
            src={tool.screenshotUrl}
            alt={`${tool.name} screenshot`}
            width={800}
            height={450}
            className="rounded-lg mb-4 w-full h-auto"
          />
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(tool.tags) && tool.tags.map((tag) => (
            <span key={tag} className="bg-blue-900 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="bg-gray-700 text-gray-300 text-sm font-semibold px-2.5 py-0.5 rounded">
            {tool.category}
          </span>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            访问网站
          </a>
        </div>
        <Comments comments={tool.comments} toolId={tool._id} isLoggedIn={!!session} />
      </div>
    </div>
  );
}