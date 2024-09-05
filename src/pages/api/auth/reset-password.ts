import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: '无效或过期的重置令牌' });
    }

    // 检查距离上次密码重置的时间间隔
    const lastResetTime = user.lastPasswordReset || new Date(0); // 如果从未重置过,使用很久以前的日期
    const timeSinceLastReset = Date.now() - lastResetTime.getTime();
    const minimumInterval = 24 * 60 * 60 * 1000; // 24小时,以毫秒为单位

    if (timeSinceLastReset < minimumInterval) {
      return res.status(400).json({ message: '密码重置过于频繁,请稍后再试' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.lastPasswordReset = new Date(); // 更新最后重置时间
    await user.save();

    res.status(200).json({ message: '密码已成功重置' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: '重置密码时出错' });
  }
}