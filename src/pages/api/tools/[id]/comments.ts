import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../../lib/dbConnect'
import AITool from '../../../../models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  await dbConnect()

  if (req.method === 'POST') {
    try {
      const { content } = req.body
      const tool = await AITool.findById(id)

      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' })
      }

      const newComment = {
        userId: session.user.id,
        content,
        createdAt: new Date().toISOString(),
      }

      tool.comments.push(newComment)
      await tool.save()

      res.status(201).json(newComment)
    } catch (error) {
      res.status(500).json({ error: 'Error adding comment' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}