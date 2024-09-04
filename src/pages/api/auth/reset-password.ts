import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import crypto from 'crypto'
import { sendResetPasswordEmail } from '../../../lib/email'
import bcrypt from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  if (req.method === 'POST') {
    // 处理发送重置密码邮件的请求
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: '请提供邮箱地址' })
    }

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: '未找到该邮箱对应的用户' })
      }

      const resetToken = crypto.randomBytes(20).toString('hex')
      user.resetPasswordToken = resetToken
      user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
      await user.save()

      await sendResetPasswordEmail(email, resetToken)

      res.status(200).json({ message: '重置密码邮件已发送' })
    } catch (error) {
      console.error('发送重置密码邮件错误:', error)
      res.status(500).json({ message: '发送重置密码邮件过程中出现错误' })
    }
  } else if (req.method === 'PUT') {
    // 处理重置密码的请求
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: '缺少必要参数' })
    }

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })

      if (!user) {
        return res.status(400).json({ message: '密码重置令牌无效或已过期' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      res.status(200).json({ message: '密码重置成功' })
    } catch (error) {
      console.error('密码重置错误:', error)
      res.status(500).json({ message: '密码重置过程中出现错误' })
    }
  } else {
    res.status(405).json({ message: '方法不允许' })
  }
}