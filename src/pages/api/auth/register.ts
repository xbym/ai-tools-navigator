import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User' // 需要创建 User 模型
import bcrypt from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
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
      role: 'user' // 默认角色为普通用户
    })

    res.status(201).json({ message: '注册成功', user: { id: user._id, username: user.username, email: user.email, role: user.role } })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '注册过程中出现错误' })
  }
}