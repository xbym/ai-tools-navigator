import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { logger } from '@/utils/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
      const { reaction } = await req.json();

      if (reaction !== 'like' && reaction !== 'dislike') {
        return NextResponse.json({ message: 'Invalid reaction type' }, { status: 400 });
      }

      const tool = await AITool.findById(toolId);
      if (!tool) {
        logger.warn(`Tool not found: ${toolId}`);
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        logger.warn(`Comment not found: ${commentId} in tool ${toolId}`);
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      // 移除之前的反应（如果有）
      if (comment.userReactions && comment.userReactions[userId]) {
        const previousReaction = comment.userReactions[userId];
        if (previousReaction === 'like') comment.likes--;
        if (previousReaction === 'dislike') comment.dislikes--;
      }

      // 添加新的反应
      if (!comment.userReactions) comment.userReactions = {};
      comment.userReactions[userId] = reaction;
      if (reaction === 'like') comment.likes++;
      if (reaction === 'dislike') comment.dislikes++;

      await tool.save();

      logger.info(`User ${userId} reacted to comment ${commentId} in tool ${toolId} with ${reaction}`);
      return NextResponse.json({ message: 'Reaction updated successfully' });
    } catch (error) {
      logger.error('Error updating reaction:', error);
      return NextResponse.json({ message: 'Error updating reaction' }, { status: 500 });
    }
  });
}