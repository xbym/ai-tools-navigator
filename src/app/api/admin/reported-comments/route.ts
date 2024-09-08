import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';

export async function GET(request: NextRequest) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      // @ts-ignore
      const userId = req.user.userId;

      const reportedComments = await AITool.aggregate([
        { $unwind: '$comments' },
        { $match: { 'comments.reports': { $exists: true, $ne: [] } } },
        {
          $project: {
            _id: 0,
            toolId: '$_id',
            toolName: '$name',
            commentId: '$comments._id',
            content: '$comments.content',
            user: '$comments.user',
            reports: '$comments.reports'
          }
        }
      ]);

      return NextResponse.json(reportedComments);
    } catch (error) {
      console.error('Error fetching reported comments:', error);
      return NextResponse.json({ message: 'Error fetching reported comments' }, { status: 500 });
    }
  })(request);
}