import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../lib/dbConnect'
import AITool from '../../../models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      const deletedTool = await AITool.findByIdAndDelete(id)
      if (!deletedTool) {
        return res.status(404).json({ message: 'Tool not found' })
      }
      res.status(200).json({ message: 'Tool deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tool' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}