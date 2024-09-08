import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { logger } from '@/utils/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
      const { type } = await req.json();
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

      // 处理点赞/踩
      if (!comment.userReactions) {
        comment.userReactions = new Map();
      }

      const previousReaction = comment.userReactions.get(userId);
      comment.userReactions.set(userId, type);

      if (previousReaction === 'like' && type !== 'like') {
        comment.likes--;
      }
      if (previousReaction === 'dislike' && type !== 'dislike') {
        comment.dislikes--;
      }
      if (type === 'like') {
        comment.likes++;
      }
      if (type === 'dislike') {
        comment.dislikes++;
      }

      await tool.save();

      logger.info(`User ${userId} reacted to comment ${commentId} for tool ${toolId} with ${type}`);
      return NextResponse.json({ message: 'Reaction added successfully' });
    } catch (error) {
      logger.error('Error adding reaction:', error);
      return NextResponse.json({ message: 'Error adding reaction' }, { status: 500 });
    }
  })(request);
}