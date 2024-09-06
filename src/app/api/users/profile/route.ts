import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return NextResponse.json({ message: '用户不存在' }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 }); // 确保这里明确设置了状态码
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}

// 如果需要，可以添加 PUT 方法来更新用户资料
export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      const data = await req.json();
      const user = await User.findByIdAndUpdate(userId, data, { new: true, select: '-password' });
      if (!user) {
        return NextResponse.json({ message: '用户不存在' }, { status: 404 });
      }
      return NextResponse.json(user);
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}