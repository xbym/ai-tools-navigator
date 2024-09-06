import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;

      const tool = await AITool.findById(toolId);
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      // 检查是否已经举报过
      if (comment.reports && comment.reports.includes(userId)) {
        return NextResponse.json({ message: 'You have already reported this comment' }, { status: 400 });
      }

      // 添加举报
      if (!comment.reports) {
        comment.reports = [];
      }
      comment.reports.push(userId);

      await tool.save();

      return NextResponse.json({ message: 'Comment reported successfully' });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}