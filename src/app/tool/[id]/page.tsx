import ToolDetailContent from '@/components/ToolDetailContent';
import { Metadata, ResolvingMetadata } from 'next'
import AITool from '@/models/AITool'
import dbConnect from '@/lib/dbConnect'
import { notFound } from 'next/navigation'

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
    <div className="container mx-auto px-4 py-8">
      <ToolDetailContent id={id} />
    </div>
  );
}