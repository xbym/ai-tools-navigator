import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
	try {
		logger.info('Password reset request');
		await dbConnect();
		const { email } = await request.json();

		const user = await User.findOne({ email });
		if (!user) {
			logger.warn('Password reset failed: User not found', { email });
			// 为了防止邮箱枚举攻击，我们返回相同的消息
			return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
		}

		const resetToken = crypto.randomBytes(20).toString('hex');
		user.resetToken = resetToken;
		user.resetTokenExpiry = new Date(Date.now() + 3600000); // 修改这一行
		await user.save();

		const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
		await sendPasswordResetEmail(user.email, resetUrl, user.username);

		logger.info('Password reset email sent', { userId: user._id });
		return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
	} catch (error) {
		return errorHandler(error, request);
	}
}