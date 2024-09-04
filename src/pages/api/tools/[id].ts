import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import AITool from '@/models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  console.log('Received request for tool ID:', id);

  await dbConnect()
  console.log('Database connected successfully');

  try {
    const tool = await AITool.findById(id)
    console.log('Tool found:', tool ? 'Yes' : 'No');

    if (!tool) {
      console.log('Tool not found for ID:', id);
      return res.status(404).json({ message: 'Tool not found' })
    }
    res.status(200).json(tool)
  } catch (error: unknown) {
    console.error('Error fetching tool:', error);
    res.status(500).json({ 
      message: 'Error fetching tool', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}