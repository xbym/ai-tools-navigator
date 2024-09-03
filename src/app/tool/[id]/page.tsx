"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import aiToolsData from '../../../../data/ai-tools.json';
import { AITool, Comment } from '../../../types/AITool';
import Comments from '../../../components/Comments';

export default function ToolDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [tool, setTool] = useState<AITool | undefined>(() => {
    const foundTool = aiToolsData.find((t) => t.id === params.id);
    return foundTool ? foundTool as AITool : undefined;
  });

  if (!tool) {
    notFound();
  }

  const averageRating = tool.ratings.length > 0
    ? tool.ratings.reduce((a, b) => a + b, 0) / tool.ratings.length
    : 0;

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      content,
      createdAt: new Date().toISOString(),
    };
    setTool({
      ...tool,
      comments: [...tool.comments, newComment],
    });
  };

  const handleAddRating = (rating: number) => {
    setTool({
      ...tool,
      ratings: [...tool.ratings, rating],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link href="/" className="text-primary hover:underline mb-4 inline-block">
        &larr; 返回首页
      </Link>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Image
            src={tool.iconUrl}
            alt={tool.name}
            width={60}
            height={60}
            className="rounded-full mr-4"
          />
          <h1 className="text-2xl font-bold">{tool.name}</h1>
        </div>
        <p className="text-gray-600 mb-4">{tool.description}</p>
        <div className="mb-4">
          <span className="bg-secondary text-xs font-semibold px-2 py-1 rounded">
            {tool.category}
          </span>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">平均评分: {averageRating.toFixed(1)}/5</p>
          {session ? (
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleAddRating(star)}
                  className={`text-2xl ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">登录后可以进行评分</p>
          )}
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          访问网站
        </a>
      </div>
      <Comments comments={tool.comments} onAddComment={handleAddComment} isLoggedIn={!!session} />
    </div>
  );
}