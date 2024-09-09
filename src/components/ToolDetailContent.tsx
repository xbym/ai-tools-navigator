"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AITool } from '@/types/AITool';

interface ToolDetailContentProps {
  tool: AITool;
}

export default function ToolDetailContent({ tool }: ToolDetailContentProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        {tool.iconUrl ? (
          <Image
            src={tool.iconUrl}
            alt={tool.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">{tool.name[0]}</span>
          </div>
        )}
        <h1 className="text-2xl font-bold ml-4 text-white">{tool.name}</h1>
      </div>
      <p className="text-gray-300 mb-4">{tool.description}</p>
      <div className="mb-4">
        <strong className="text-white">类别：</strong>
        <span className="text-gray-300">{tool.category}</span>
      </div>
      <div className="mb-4">
        <strong className="text-white">标签：</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {tool.tags?.map((tag) => (
            <span key={tag} className="bg-blue-600 text-white text-sm px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <strong className="text-white">网址：</strong>
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          {tool.url}
        </a>
      </div>
      {tool.averageRating !== undefined && (
        <div className="mb-4">
          <strong className="text-white">平均评分：</strong>
          <span className="text-yellow-400">{tool.averageRating.toFixed(1)}</span>
        </div>
      )}
      {tool.viewCount !== undefined && (
        <div>
          <strong className="text-white">浏览次数：</strong>
          <span className="text-gray-300">{tool.viewCount}</span>
        </div>
      )}
    </div>
  );
}