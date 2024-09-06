import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/authMiddleware';
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      logger.info('Updating user profile');
      await dbConnect();

      const { username, email } = await req.json();
      const user = await User.findById(userId);

      if (!user) {
        logger.warn('Profile update failed: User not found', { userId });
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();

      logger.info('Profile updated successfully', { userId: user._id });
      return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}