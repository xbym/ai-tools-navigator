"use client";

import { AITool } from '../types/AITool';
import Image from 'next/image';
import Link from 'next/link';

interface AIToolListProps {
  tools: AITool[];
}

export default function AIToolList({ tools }: AIToolListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Link href={`/tool/${tool._id}`} key={tool._id}>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition duration-300">
            <div className="flex items-center mb-4">
              <Image
                src={tool.iconUrl}
                alt={tool.name}
                width={50}
                height={50}
                className="rounded-full mr-4"
                loading="lazy"
              />
              <h2 className="text-xl font-semibold text-blue-400">{tool.name}</h2>
            </div>
            <p className="text-gray-300 mb-4">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                {tool.category}
              </span>
              {tool.tags.map((tag) => (
                <span key={tag} className="bg-blue-900 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
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