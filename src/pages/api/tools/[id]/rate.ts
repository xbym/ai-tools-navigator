import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import authOptions from "@/pages/api/auth/[...nextauth]"
import dbConnect from '@/lib/dbConnect'
import AITool from '@/models/AITool'
import { Rating } from '@/types/AITool'
import { Session } from 'next-auth'  // 添加这行

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions) as Session & { user: { id: string } }  // 修改这行
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query
  const { score } = req.body

  await dbConnect()

  if (req.method === 'POST') {
    try {
      const tool = await AITool.findById(id)
      if (!tool) {
        return res.status(404).json({ message: 'Tool not found' })
      }

      const existingRatingIndex = tool.ratings.findIndex(
        (rating: Rating) => rating.userId === session.user.id
      )

      if (existingRatingIndex > -1) {
        tool.ratings[existingRatingIndex].score = score
      } else {
        tool.ratings.push({ userId: session.user.id, score })
      }

      const totalScore = tool.ratings.reduce((sum: number, rating: Rating) => sum + rating.score, 0)
      tool.averageRating = totalScore / tool.ratings.length

      await tool.save()

      res.status(200).json({ averageRating: tool.averageRating })
    } catch (error) {
      res.status(500).json({ message: 'Error rating tool' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}