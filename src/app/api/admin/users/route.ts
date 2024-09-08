import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      // @ts-ignore
      const userId = req.user.userId;

      // 确保只有管理员可以访问用户列表
      const currentUser = await User.findById(userId);
      if (!currentUser || currentUser.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }

      const users = await User.find({}, '-password').sort({ createdAt: -1 });
      return NextResponse.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
  })(request);
}