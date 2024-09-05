import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email'; // 你需要创建这个函数来发送邮件

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // 即使用户不存在，我们也返回成功以防止邮箱枚举攻击
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'AI工具导航 - 密码重置',
      text: `请点击以下链接重置您的密码：${resetUrl}`,
      html: `
        <h1>AI工具导航 - 密码重置</h1>
        <p>您好，</p>
        <p>我们收到了重置您账户密码的请求。如果这不是您本人的操作，请忽略此邮件。</p>
        <p>如果您确实想要重置密码，请点击下面的链接：</p>
        <a href="${resetUrl}">重置密码</a>
        <p>此链接将在一小时后失效。</p>
        <p>谢谢！</p>
        <p>AI工具导航团队</p>
      `,
    });

    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error sending reset link' });
  }
}