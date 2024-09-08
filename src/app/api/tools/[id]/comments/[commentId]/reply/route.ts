import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import User from '@/models/User';  // 添加这行
import { logger } from '@/utils/logger';

const MAX_REPLY_LENGTH = 1000; // 设置最大回复长度

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
      const { content } = await req.json();

      // 内容验证
      if (!content || content.trim() === '') {
        return NextResponse.json({ message: 'Reply content cannot be empty' }, { status: 400 });
      }
      if (content.length > MAX_REPLY_LENGTH) {
        return NextResponse.json({ message: `Reply content cannot exceed ${MAX_REPLY_LENGTH} characters` }, { status: 400 });
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

      const user = await User.findById(userId);
      if (!user) {
        logger.warn(`User not found: ${userId}`);
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const newReply = {
        userId,
        username: user.username || 'Anonymous',
        content: content.trim(),
        avatarUrl: user.avatarUrl,
        createdAt: new Date()
      };

      comment.replies.push(newReply);
      await tool.save();

      logger.info(`New reply added to comment ${commentId} in tool ${toolId} by user ${userId}`);
      return NextResponse.json(newReply);
    } catch (error) {
      logger.error('Error adding reply:', error);
      return NextResponse.json({ message: 'Error adding reply' }, { status: 500 });
    }
  });
}