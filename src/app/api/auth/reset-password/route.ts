import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    logger.info('Password reset attempt');
    await dbConnect();
    const { token, password } = await request.json();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      logger.warn('Password reset failed: Invalid or expired token');
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    logger.info('Password reset successful', { userId: user._id });
    return NextResponse.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    return errorHandler(error, request);
  }
}