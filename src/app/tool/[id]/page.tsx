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
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <Image
              src={tool.iconUrl}
              alt={tool.name}
              width={80}
              height={80}
              className="rounded-full mb-4 md:mb-0 md:mr-6"
              loading="eager"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-400 text-center md:text-left">{tool.name}</h1>
          </div>
          <p className="text-gray-300 mb-6 text-base md:text-lg">{tool.description}</p>
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="bg-gray-700 text-gray-300 text-xs md:text-sm font-semibold px-2.5 py-0.5 rounded">
              {tool.category}
            </span>
            {tool.tags.map((tag) => (
              <span key={tag} className="bg-blue-900 text-blue-200 text-xs md:text-sm font-semibold px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            访问网站
          </a>
          {tool.screenshotUrl && (
            <div className="mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">工具截图</h2>
              <Image
                src={tool.screenshotUrl}
                alt={`${tool.name} 截图`}
                width={800}
                height={450}
                className="rounded-lg w-full"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}