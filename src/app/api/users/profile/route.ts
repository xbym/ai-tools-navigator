import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/authMiddleware';
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      logger.info('Fetching user profile');
      await dbConnect();

      const user = await User.findById(userId).select('-password');
      if (!user) {
        logger.warn('Profile fetch failed: User not found', { userId });
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      logger.info('Profile fetched successfully', { userId: user._id });
      return NextResponse.json(user);
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}