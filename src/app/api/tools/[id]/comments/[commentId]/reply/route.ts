import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import User from '@/models/User';  // 添加这行

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
      const { content } = await req.json();

      const tool = await AITool.findById(toolId);
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const newReply = {
        userId,
        username: user.username || 'Anonymous',  // 确保始终有 username
        content,
        avatarUrl: user.avatarUrl
      };

      comment.replies.push(newReply);
      await tool.save();

      return NextResponse.json(newReply);
    } catch (error) {
      console.error('Error adding reply:', error);
      return NextResponse.json({ message: 'Error adding reply' }, { status: 500 });
    }
  });
}