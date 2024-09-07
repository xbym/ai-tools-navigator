import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next'
import AITool from '@/models/AITool'
import dbConnect from '@/lib/dbConnect'
import { notFound } from 'next/navigation'
import Layout from '@/components/Layout'
import dynamic from 'next/dynamic'

const ToolDetailContent = dynamic(() => import('@/components/ToolDetailContent'), {
  loading: () => <p>Loading tool details...</p>,
})

const CommentSection = dynamic(() => import('@/components/CommentSection'), {
  loading: () => <p>Loading comments...</p>,
  ssr: false,
})

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id

  await dbConnect()
  const tool = await AITool.findById(id)

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested AI tool could not be found.',
    }
  }

  return {
    title: `${tool.name} - AI Tool Details`,
    description: tool.description,
  }
}

export default async function ToolDetail({ params }: Props) {
  const { id } = params;

  await dbConnect()
  const tool = await AITool.findById(id)

  if (!tool) {
    notFound()
  }

  return (
    <Layout title={`${tool.name} - AI Tool Details`}>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading tool details...</div>}>
          <ToolDetailContent id={id} />
        </Suspense>
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection toolId={id} />
        </Suspense>
      </div>
    </Layout>
  );
}