"use client";

import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { AITool } from '@/types/AITool';
import Head from 'next/head';

export default function ToolDetail({ params }: { params: { id: string } }) {
  const [tool, setTool] = React.useState<AITool | null>(null);

  React.useEffect(() => {
    const fetchTool = async () => {
      const response = await fetch(`/api/tools/${params.id}`);
      const data = await response.json();
      setTool(data);
    };
    fetchTool();
  }, [params.id]);

  if (!tool) {
    return <div>Loading...</div>;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": tool.category,
    "operatingSystem": "Web",
    "url": tool.url,
    "image": tool.iconUrl,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.averageRating,
      "ratingCount": tool.ratings.length
    }
  };

  return (
    <Layout title={`${tool.name} - AI工具导航`} description={tool.description}>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Head>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Image
            src={tool.iconUrl}
            alt={tool.name}
            width={80}
            height={80}
            className="rounded-full mr-4"
            loading="eager"
          />
          <h1 className="text-3xl font-bold text-blue-400">{tool.name}</h1>
        </div>
        <p className="text-gray-300 mb-4">{tool.description}</p>
        <div className="mb-4">
          <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
            {tool.category}
          </span>
          {tool.tags.map((tag) => (
            <span key={tag} className="bg-blue-900 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
              {tag}
            </span>
          ))}
        </div>
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          访问网站
        </a>
        {tool.screenshotUrl && (
          <div className="mt-6">
            <Image
              src={tool.screenshotUrl}
              alt={`${tool.name} 截图`}
              width={800}
              height={450}
              className="rounded-lg"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}