import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import AITool from '../../models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const tools = await AITool.find({});
      res.status(200).json(tools);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch AI tools' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}