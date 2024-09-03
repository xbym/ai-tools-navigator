"use client";

import { AITool } from '../types/AITool';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AIToolListProps {
  tools: AITool[];
}

export default function AIToolList({ tools }: AIToolListProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="text-center">正在加载AI工具列表...</div>;
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '文本生成':
        return 'bg-green-100 text-green-800';
      case '图像生成':
        return 'bg-purple-100 text-purple-800';
      case '音频处理':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <div key={tool.id} className="border rounded-lg p-4 shadow-md">
          <Link href={`/tool/${tool.id}`} className="block">
            <div className="flex items-center mb-2">
              <ImageWithFallback
                src={tool.iconUrl}
                alt={tool.name}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <h2 className="text-lg font-semibold">{tool.name}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
          </Link>
          <div className="flex justify-between items-center mb-2">
            <span className={`${getCategoryColor(tool.category)} text-xs font-semibold px-2 py-1 rounded`}>
              {tool.category}
            </span>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">访问网站</a>
          </div>
          <div className="flex flex-wrap gap-1">
            {tool.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageWithFallback({ src, alt, ...props }: any) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? '/icons/placeholder.svg' : src}
      alt={alt}
      {...props}
      onError={() => setError(true)}
    />
  );
}