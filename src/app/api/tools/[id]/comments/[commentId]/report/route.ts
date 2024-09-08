import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import Notification from '@/models/Notification';
import { logger } from '@/utils/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
      // @ts-ignore
      const userId = req.user.userId;

      const tool = await AITool.findById(toolId);
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      if (comment.reports.includes(userId)) {
        return NextResponse.json({ message: 'You have already reported this comment' }, { status: 400 });
      }

      comment.reports.push(userId);
      await tool.save();

      // 创建通知
      await Notification.create({
        type: 'comment_report',
        toolId,
        commentId,
        reporterId: userId
      });

      logger.info(`User ${userId} reported comment ${commentId} for tool ${toolId}`);
      return NextResponse.json({ message: 'Comment reported successfully' });
    } catch (error) {
      logger.error('Error reporting comment:', error);
      return NextResponse.json({ message: 'Error reporting comment' }, { status: 500 });
    }
  })(request);
}