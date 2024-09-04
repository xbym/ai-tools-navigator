import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import AITool from '@/models/AITool'
import { logError } from '@/lib/errorLogger'
import * as Sentry from "@sentry/nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  console.log(`Fetching tool with id: ${id}`);

  await dbConnect()

  try {
    const tool = await AITool.findById(id)

    if (!tool) {
      console.log(`Tool with id ${id} not found`);
      return res.status(404).json({ message: 'Tool not found' })
    }
    console.log(`Tool found: ${tool.name}`);
    res.status(200).json(tool)
  } catch (error: unknown) {
    console.error('Error in /api/tools/[id]:', error);
    Sentry.captureException(error);
    await logError(error as Error, req, 'high');
    res.status(500).json({ 
      message: 'Error fetching tool', 
      error: (error as Error).message 
    });
  }
}