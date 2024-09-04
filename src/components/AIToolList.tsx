"use client";

import { AITool } from '@/types/AITool';
import Image from 'next/image';
import Link from 'next/link';

interface AIToolListProps {
  tools: AITool[];
}

export default function AIToolList({ tools }: AIToolListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Link href={`/tool/${tool._id}`} key={tool._id}>
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700 transition duration-300">
            <div className="flex items-center mb-3">
              <Image
                src={tool.iconUrl}
                alt={tool.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
                loading="lazy"
              />
              <h2 className="text-lg font-semibold text-blue-400 truncate">{tool.name}</h2>
            </div>
            <p className="text-gray-300 mb-3 text-sm line-clamp-2">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                {tool.category}
              </span>
              {tool.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-blue-900 text-blue-200 text-xs font-semibold px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}