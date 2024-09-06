import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import AITool from '@/models/AITool';

// 定义评论的接口
interface IComment {
  _id: string;
  userId: string | { _id: string; username: string };
  content: string;
  rating: number;
  createdAt: Date;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      const { content, rating } = await req.json();
      const tool = await AITool.findById(params.id);

      if (!tool) {
        return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
      }

      tool.comments.push({ userId, content, rating });
      tool.updateAverageRating();
      await tool.save();

      return NextResponse.json({ message: '评论已添加' }, { status: 201 });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tool = await AITool.findById(params.id).populate('comments.userId', 'username');

    if (!tool) {
      return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
    }

    // 确保返回的评论数据结构正确
    const formattedComments = tool.comments.map((comment: IComment) => ({
      _id: comment._id,
      userId: typeof comment.userId === 'object' ? comment.userId : { _id: comment.userId, username: '匿名用户' },
      content: comment.content,
      rating: comment.rating,
      createdAt: comment.createdAt
    }));

    return NextResponse.json(formattedComments);
  } catch (error) {
    return errorHandler(error, request);
  }
}