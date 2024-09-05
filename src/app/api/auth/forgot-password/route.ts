import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log('Connected to database');

    const { email } = await req.json();
    console.log('Received email:', email);

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (user) {
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
      console.log('Reset token saved for user');

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
      console.log('Reset URL:', resetUrl);

      try {
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
        console.log('Reset email sent');
      } catch (emailError: unknown) {
        console.error('Error sending email:', emailError);
        return NextResponse.json({ message: 'Error sending reset email', error: emailError instanceof Error ? emailError.message : String(emailError) }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error: unknown) {
    console.error('Password reset error:', error);
    return NextResponse.json({ message: 'Error processing reset request', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}