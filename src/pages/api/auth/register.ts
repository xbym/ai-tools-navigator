import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'

// 这里应该是你的数据库连接
// import { db } from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允许 POST 请求' })
  }

  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: '请提供所有必要的信息' })
  }

  try {
    // 检查用户是否已存在
    // const existingUser = await db.user.findUnique({ where: { email } })
    // if (existingUser) {
    //   return res.status(400).json({ message: '该邮箱已被注册' })
    // }

    // 哈希密码
    const hashedPassword = await hash(password, 12)

    // 创建新用户
    // const user = await db.user.create({
    //   data: {
    //     username,
    //     email,
    //     password: hashedPassword,
    //   },
    // })

    // 模拟创建用户
    const user = { id: '1', username, email }

    res.status(201).json({ message: '用户注册成功', user })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '注册过程中出现错误' })
  }
}