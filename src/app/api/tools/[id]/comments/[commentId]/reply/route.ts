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
      const body = await req.json();
      logger.info(`Received reply request for tool ${toolId}, comment ${commentId}:`, body);

      const { content } = body;

      // 内容验证
      if (!content || content.trim() === '') {
        logger.warn('Empty reply content received');
        return NextResponse.json({ message: '回复内容不能为空' }, { status: 400 });
      }

      if (content.length > MAX_REPLY_LENGTH) {
        logger.warn(`Reply content exceeds max length: ${content.length}`);
        return NextResponse.json({ message: '回复内容超过最大长度限制' }, { status: 400 });
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
        userId: user._id, // 确保使用 user._id 而不是 userId
        username: user.username || 'Anonymous',
        content: content.trim(),
        avatarUrl: user.avatarUrl || '/default-avatar.png',
        createdAt: new Date()
      };

      comment.replies.push(newReply);

      // 使用 markModified 来确保 Mongoose 知道 replies 数组已被修改
      tool.markModified('comments');

      await tool.save();

      logger.info(`New reply added to comment ${commentId} in tool ${toolId} by user ${userId}`);
      return NextResponse.json(newReply);
    } catch (error: unknown) {
      logger.error('Error adding reply:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json({ message: 'Error adding reply', error: errorMessage }, { status: 500 });
    }
  });
}