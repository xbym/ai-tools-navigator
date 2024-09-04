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
        <div key={tool._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
          <Link href={`/tool/${tool._id}`}>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Image
                  src={tool.iconUrl}
                  alt={tool.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <h2 className="text-xl font-semibold text-blue-300">{tool.name}</h2>
              </div>
              <p className="text-gray-400 mb-3 h-12 overflow-hidden">{tool.description}</p>
              {tool.screenshotUrl && (
                <Image
                  src={tool.screenshotUrl}
                  alt={`${tool.name} screenshot`}
                  width={300}
                  height={200}
                  className="rounded-md mb-3 w-full h-40 object-cover"
                />
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.isArray(tool.tags) && tool.tags.map((tag) => (
                  <span key={tag} className="bg-blue-900 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {tool.category}
                </span>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                  访问网站
                </a>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}