import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { logger } from '@/utils/logger';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string; replyId: string } }
) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { id: toolId, commentId, replyId } = params;
      const { content } = await req.json();
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

      const reply = comment.replies.id(replyId);
      if (!reply) {
        return NextResponse.json({ message: 'Reply not found' }, { status: 404 });
      }

      if (reply.userId.toString() !== userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }

      reply.content = content;
      await tool.save();

      logger.info(`Reply ${replyId} updated for comment ${commentId} on tool ${toolId}`);
      return NextResponse.json({ message: 'Reply updated successfully' });
    } catch (error) {
      logger.error('Error updating reply:', error);
      return NextResponse.json({ message: 'Error updating reply' }, { status: 500 });
    }
  })(request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string; replyId: string } }
) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { id: toolId, commentId, replyId } = params;
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

      const reply = comment.replies.id(replyId);
      if (!reply) {
        return NextResponse.json({ message: 'Reply not found' }, { status: 404 });
      }

      if (reply.userId.toString() !== userId && tool.createdBy.toString() !== userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }

      comment.replies.pull(replyId);
      await tool.save();

      return NextResponse.json({ message: 'Reply deleted successfully' });
    } catch (error) {
      logger.error('Error deleting reply:', error);
      return NextResponse.json({ message: 'Error deleting reply' }, { status: 500 });
    }
  })(request);
}