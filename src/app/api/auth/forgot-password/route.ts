import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
	await dbConnect();

	const { email } = await req.json();

	try {
		const user = await User.findOne({ email });

		if (!user) {
			// 即使用户不存在，我们也返回成功以防止邮箱枚举攻击
			return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
		}

		const resetToken = crypto.randomBytes(20).toString('hex');
		const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

		user.resetToken = resetToken;
		user.resetTokenExpiry = resetTokenExpiry;
		await user.save();
		console.log('Reset token saved for user');

		const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

		await sendPasswordResetEmail(user.email, resetUrl, user.username);

		return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
	} catch (error) {
		console.error('Password reset error:', error);
		return NextResponse.json({ message: 'Error sending reset link' }, { status: 500 });
	}
}