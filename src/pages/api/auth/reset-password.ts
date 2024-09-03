import type { NextApiRequest, NextApiResponse } from 'next'

// 这里应该是你的数据库连接和邮件发送功能
// import { db } from '../../../lib/db'
// import { sendResetEmail } from '../../../lib/email'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允许 POST 请求' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: '请提供邮箱地址' })
  }

  try {
    // 查找用户
    // const user = await db.user.findUnique({ where: { email } })
    // if (!user) {
    //   return res.status(404).json({ message: '未找到该邮箱对应的用户' })
    // }

    // 生成重置令牌
    // const resetToken = generateResetToken()
    // await db.user.update({
    //   where: { id: user.id },
    //   data: { resetToken, resetTokenExpires: new Date(Date.now() + 3600000) },
    // })

    // 发送重置邮件
    // await sendResetEmail(email, resetToken)

    // 模拟发送重置邮件
    console.log('模拟发送重置邮件到:', email)

    res.status(200).json({ message: '重置密码邮件已发送' })
  } catch (error) {
    console.error('密码重置错误:', error)
    res.status(500).json({ message: '密码重置过程中出现错误' })
  }
}