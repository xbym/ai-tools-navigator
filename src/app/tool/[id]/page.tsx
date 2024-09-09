import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ToolDetailContent from '@/components/ToolDetailContent';
import CommentSection from '@/components/CommentSection';
import { AITool } from '@/types/AITool';

async function getToolDetails(id: string): Promise<AITool> {
  console.log(`Fetching tool details for ID: ${id}`);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tools/${id}`;
  console.log(`API URL: ${url}`);
  const res = await fetch(url, { cache: 'no-store' });
  console.log(`API response status: ${res.status}`);
  if (!res.ok) {
    console.log(`API response not OK. Status: ${res.status}`);
    if (res.status === 404) {
      throw new Error('Tool not found');
    }
    const errorText = await res.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed to fetch tool details: ${errorText}`);
  }
  const data = await res.json();
  console.log('Fetched tool data:', data);
  return data;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const tool = await getToolDetails(params.id);
    return {
      title: `${tool.name} - AI工具导航`,
      description: tool.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'AI工具详情 - AI工具导航',
      description: 'AI工具的详细信息',
    };
  }
}

export default async function ToolPage({ params }: { params: { id: string } }) {
  let tool: AITool;

  try {
    console.log(`Attempting to fetch tool with ID: ${params.id}`);
    tool = await getToolDetails(params.id);
    console.log('Successfully fetched tool:', tool);
  } catch (error) {
    console.error('Error fetching tool details:', error);
    if (error instanceof Error && error.message.includes('Tool not found')) {
      console.log('Tool not found, calling notFound()');
      notFound();
    }
    console.log('Throwing error for Next.js error boundary');
    throw error;
  }

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading tool details...</div>}>
          <ToolDetailContent tool={tool} />
        </Suspense>
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection toolId={params.id} />
        </Suspense>
      </div>
    </main>
  );
}