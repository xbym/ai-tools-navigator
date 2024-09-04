import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  await dbConnect()

  const { username, email } = req.body

  try {
    const user = await User.findById(session.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.username = username
    user.email = email
    await user.save()

    res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Error updating profile' })
  }
}