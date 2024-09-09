import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ToolDetailContent from '@/components/ToolDetailContent';
import CommentSection from '@/components/CommentSection';
import { AITool } from '@/types/AITool';

async function getToolDetails(id: string): Promise<AITool> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch tool details');
  }
  return res.json();
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
    tool = await getToolDetails(params.id);
  } catch (error) {
    console.error('Error fetching tool details:', error);
    notFound();
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