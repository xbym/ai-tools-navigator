import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getSession({ req })
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await dbConnect()

  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    res.status(201).json({ message: '管理员注册成功', user: { id: user._id, username: user.username, email: user.email, role: user.role } })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '注册过程中出现错误' })
  }
}