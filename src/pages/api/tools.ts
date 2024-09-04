import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import AITool from '../../models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.query.search as string;
    let query = {};
    if (searchTerm) {
      query = { $text: { $search: searchTerm } };
    }

    try {
      const tools = await AITool.find(query).skip(skip).limit(limit);
      const total = await AITool.countDocuments(query);
      res.status(200).json({
        tools,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch AI tools' });
    }
  } else if (req.method === 'POST') {
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