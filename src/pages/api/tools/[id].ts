import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import AITool from '@/models/AITool'
import { logger } from '@/utils/logger'
import { logError } from '@/lib/errorLogger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  logger.info(`Received request for tool ID: ${id}`);

  await dbConnect()
  logger.info('Database connected successfully');

  try {
    const tool = await AITool.findById(id)
    logger.info(`Tool found: ${tool ? 'Yes' : 'No'}`);

    if (!tool) {
      logger.warn(`Tool not found for ID: ${id}`);
      return res.status(404).json({ message: 'Tool not found' })
    }
    res.status(200).json(tool)
  } catch (error: unknown) {
    console.error('Error in /api/tools/[id]:', error);
    await logError(error as Error, req, 'high');
    res.status(500).json({ 
      message: 'Error fetching tool', 
      error: (error as Error).message 
    });
  }
}