import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { id: toolId } = params;
      const { content, rating } = await req.json();
      // @ts-ignore
      const userId = req.user.userId;

      const tool = await AITool.findById(toolId);
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      tool.comments.push({
        user: userId,
        content,
        rating,
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
        userReactions: new Map(),
        reports: []
      });

      await tool.save();

      logger.info(`New comment added to tool ${toolId}`);
      return NextResponse.json({ message: 'Comment added successfully' });
    } catch (error) {
      logger.error('Error adding comment:', error);
      return NextResponse.json({ message: 'Error adding comment' }, { status: 500 });
    }
  })(request);
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const toolId = params.id;
  const tool = await AITool.findById(toolId).populate({
    path: 'comments.user',
    select: 'username avatarUrl'
  });

  if (!tool) {
    return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
  }

  const comments = tool.comments.map((comment: any) => {
    const commentObj = comment.toObject();
    return {
      ...commentObj,
      user: {
        id: commentObj.user?._id || commentObj.user,
        username: commentObj.user?.username || 'Anonymous',
        avatarUrl: commentObj.user?.avatarUrl || '/default-avatar.png'
      }
    };
  });

  return NextResponse.json({ comments });
}

// 添加新的路由处理函数
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const toolId = params.id;
    const { commentId, content, rating } = await request.json();

    const tool = await AITool.findById(toolId);
    if (!tool) {
      return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    const comment = tool.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    // 更新评论
    comment.content = content;
    comment.rating = rating;
    await tool.save();

    return NextResponse.json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: 'Error updating comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { commentId } = await req.json();
      const tool = await AITool.findById(params.id);
      // @ts-ignore
      const userId = req.user.userId;

      if (!tool) {
        return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ message: '评论不存在' }, { status: 404 });
      }

      if (comment.user.toString() !== userId) {
        return NextResponse.json({ message: '无权删除此评论' }, { status: 403 });
      }

      tool.comments.pull(commentId);
      await tool.save();

      return NextResponse.json({ message: '评论已删除' });
    } catch (error) {
      logger.error('Error in DELETE /api/tools/[id]/comments:', error);
      return NextResponse.json({ message: 'Error deleting comment' }, { status: 500 });
    }
  })(request);
}