import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import AITool from '../../models/AITool'
import { getSession } from 'next-auth/react'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await getSession({ req });

  if (req.method === 'GET') {
    try {
      const tools = await AITool.find({});
      res.status(200).json(tools);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch AI tools' });
    }
  } else if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const tool = await AITool.create(req.body);
      res.status(201).json(tool);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add AI tool' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}