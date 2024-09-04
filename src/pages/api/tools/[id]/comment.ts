import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../../lib/dbConnect'
import AITool from '../../../../models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { id } = req.query

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const skip = (page - 1) * limit;

      const tool = await AITool.findById(id);
      if (!tool) {
        return res.status(404).json({ message: 'Tool not found' });
      }

      const totalComments = tool.comments.length;
      const paginatedComments = tool.comments.slice(skip, skip + limit);

      res.status(200).json({
        comments: paginatedComments,
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments: totalComments
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments' });
    }
  } else if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { content } = req.body

    try {
      const tool = await AITool.findById(id)
      if (!tool) {
        return res.status(404).json({ message: 'Tool not found' })
      }

      const newComment = {
        userId: session.user.id,
        content,
        createdAt: new Date().toISOString()
      }

      tool.comments.push(newComment)
      await tool.save()

      res.status(201).json(newComment)
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}