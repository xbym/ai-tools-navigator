import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import AITool from '../../../models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const tool = await AITool.findById(id)
      if (!tool) {
        return res.status(404).json({ message: 'Tool not found' })
      }
      res.status(200).json(tool)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tool' })
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedTool = await AITool.findByIdAndUpdate(id, req.body, { new: true })
      if (!updatedTool) {
        return res.status(404).json({ message: 'Tool not found' })
      }
      res.status(200).json(updatedTool)
    } catch (error) {
      res.status(500).json({ message: 'Error updating tool' })
    }
  } else if (req.method === 'DELETE') {
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