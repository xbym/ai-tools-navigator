import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import AITool from '@/models/AITool'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect()
    const tools = await AITool.find({})
    res.status(200).json({ tools }) // 注意这里的变化
  } catch (error: unknown) {
    console.error('Error fetching tools:', error)
    res.status(500).json({ message: 'Error fetching tools', error: error instanceof Error ? error.message : String(error) })
  }
}