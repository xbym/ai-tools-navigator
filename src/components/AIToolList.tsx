"use client";

import { AITool } from '@/types/AITool';
import Image from 'next/image';
import Link from 'next/link';

interface AIToolListProps {
  tools: AITool[];
}

export default function AIToolList({ tools }: AIToolListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <div key={tool._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <Link href={`/tools/${tool._id}`}>
            <div className="flex items-center mb-3">
              {tool.iconUrl ? (
                <Image
                  src={tool.iconUrl}
                  alt={tool.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">{tool.name[0]}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold ml-3 text-white">{tool.name}</h2>
            </div>
            <p className="text-gray-300 mb-3">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags?.map((tag) => (
                <span key={tag} className="bg-blue-600 text-white text-sm px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}