import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import User from '@/models/User';  // 添加这行
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';

export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();

      // 检查用户是否为管理员
      const user = await User.findById(userId);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }

      const reportedComments = await AITool.aggregate([
        { $unwind: '$comments' },
        { $match: { 'comments.reports': { $exists: true, $ne: [] } } },
        {
          $project: {
            _id: 0,
            toolId: '$_id',
            commentId: '$comments._id',
            content: '$comments.content',
            reports: '$comments.reports',
            user: '$comments.user'
          }
        }
      ]);

      return NextResponse.json({ comments: reportedComments });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}