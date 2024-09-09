import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import AITool from '@/models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  await dbConnect()

  try {
    console.log(`Fetching tool with id: ${id}`);
    const tool = await AITool.findById(id);
    console.log(`Tool found:`, tool);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' })
    }
    res.status(200).json(tool)
  } catch (error) {
    console.error('Error fetching tool:', error)
    res.status(500).json({ message: 'Error fetching tool' })
  }
}