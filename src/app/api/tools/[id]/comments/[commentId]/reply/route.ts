import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import User from '@/models/User'; // 添加这行
import { logger } from '@/utils/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
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

      // 获取用户信息
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      comment.replies.push({ 
        userId, 
        content,
        username: user.username, // 添加用户名
        avatarUrl: user.avatarUrl || '/default-avatar.png' // 添加头像URL
      });
      await tool.save();

      logger.info(`New reply added to comment ${commentId} for tool ${toolId}`);
      return NextResponse.json({ message: 'Reply added successfully' });
    } catch (error) {
      logger.error('Error adding reply:', error);
      return NextResponse.json({ message: 'Error adding reply' }, { status: 500 });
    }
  })(request);
}