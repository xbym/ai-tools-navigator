import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import mongoose from 'mongoose';  // 添加这行

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
  _id: mongoose.Types.ObjectId;  // 修改这行
  username: string;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { content, rating } = await req.json();
      const tool = await AITool.findById(params.id);

      if (!tool) {
        return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
      }

      // 添加一个小延迟,模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

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
    await dbConnect();
    const toolId = params.id;
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const tool = await AITool.findById(toolId);
    if (!tool) {
      return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    const sortOptions: { [key: string]: 1 | -1 } = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const comments = await AITool.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(toolId) } },  // 修改这行
      { $unwind: '$comments' },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: '$comments._id',
          content: '$comments.content',
          rating: '$comments.rating',
          createdAt: '$comments.createdAt',
          user: { $arrayElemAt: ['$user', 0] }
        }
      },
      {
        $group: {
          _id: null,
          comments: { $push: '$$ROOT' },
          total: { $sum: 1 }
        }
      }
    ]);

    const result = comments[0] || { comments: [], total: 0 };

    return NextResponse.json({
      comments: result.comments.map((comment: any) => ({
        ...comment,
        user: comment.user ? {
          username: comment.user.username || '匿名用户',
          avatarUrl: comment.user.avatarUrl || '/default-avatar.png'
        } : {
          username: '匿名用户',
          avatarUrl: '/default-avatar.png'
        }
      })),
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
      totalComments: result.total
    });
  } catch (error) {
    return errorHandler(error, request);
  }
}