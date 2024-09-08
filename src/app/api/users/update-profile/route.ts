import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request: NextRequest) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { username, email, avatarUrl } = await req.json();
      // @ts-ignore
      const userId = req.user.userId;

      const user = await User.findByIdAndUpdate(userId, { username, email, avatarUrl }, { new: true }).select('-password');
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json({ message: 'Error updating user profile' }, { status: 500 });
    }
  })(request);
}