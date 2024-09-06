import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import AITool from '@/models/AITool';
import User from '@/models/User';
import { Types } from 'mongoose';

// 定义评论的接口
interface IComment {
  _id: string;
  userId: string | { _id: string; username: string };
  content: string;
  rating: number;
  createdAt: Date;
}

// 定义用户文档的接口
interface IUser {
  _id: Types.ObjectId;
  username: string;
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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const tool = await AITool.findById(params.id);

    if (!tool) {
      return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
    }

    const totalComments = tool.comments.length;
    const paginatedComments = tool.comments.slice(skip, skip + limit);

    // 确保返回的评论数据结构正确
    const formattedComments = await Promise.all(paginatedComments.map(async (comment: IComment) => {
      let userId = comment.userId;
      if (typeof userId === 'string') {
        const user = await User.findById(userId).select('username') as IUser | null;
        userId = user 
          ? { _id: user._id.toString(), username: user.username } 
          : { _id: userId, username: '匿名用户' };
      }
      return {
        _id: comment._id,
        userId,
        content: comment.content,
        rating: comment.rating,
        createdAt: comment.createdAt
      };
    }));

    return NextResponse.json({
      comments: formattedComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments
    });
  } catch (error) {
    return errorHandler(error, request);
  }
}