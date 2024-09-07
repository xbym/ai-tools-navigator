import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
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
            reports: '$comments.reports',
            userId: '$comments.userId'
          }
        }
      ]);
      return NextResponse.json({ comments: reportedComments });
    } catch (error) {
      console.error('Error fetching reported comments:', error);
      return NextResponse.json({ message: 'Error fetching reported comments' }, { status: 500 });
    }
  });
}