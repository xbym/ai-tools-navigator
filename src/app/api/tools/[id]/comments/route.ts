import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import mongoose from 'mongoose';  // 添加这行
import { logger } from '@/utils/logger';  // 添加这行
import jwt from 'jsonwebtoken';  // 添加这行

// 添加这个类型声明
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
  }
}

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
      
      // 验证 content 和 rating
      if (!content || typeof content !== 'string' || content.trim() === '') {
        return NextResponse.json({ message: '评论内容不能为空' }, { status: 400 });
      }
      if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return NextResponse.json({ message: '评分必须是1到5之间的数字' }, { status: 400 });
      }

      // 使用从 authMiddleware 传递的 userId
      const userObjectId = new mongoose.Types.ObjectId(userId);
      
      const tool = await AITool.findById(params.id);
      if (!tool) {
        return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
      }

      tool.comments.push({ userId: userObjectId, content, rating });
      tool.updateAverageRating();
      await tool.save();

      return NextResponse.json({ message: '评论已添加' }, { status: 201 });
    } catch (error) {
      logger.error('Error in POST /api/tools/[id]/comments:', error);
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
    const searchQuery = request.nextUrl.searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const tool = await AITool.findById(toolId);
    if (!tool) {
      return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    const sortOptions: { [key: string]: 1 | -1 } = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const searchFilter = searchQuery
      ? { $match: { 'comments.content': { $regex: searchQuery, $options: 'i' } } }
      : { $match: {} };

    const comments = await AITool.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(toolId) } },
      { $unwind: '$comments' },
      searchFilter,
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
          likes: '$comments.likes',
          dislikes: '$comments.dislikes',
          userReactions: '$comments.userReactions',
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

    // 尝试从请求中获取用户ID,如果没有则为null
    let userId = null;
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        userId = decoded.userId;
      }
    } catch (error) {
      logger.warn('Failed to decode token:', error);
    }

    return NextResponse.json({
      comments: result.comments.map((comment: any) => ({
        ...comment,
        user: comment.user ? {
          id: comment.user._id.toString(),
          username: comment.user.username || '匿名用户',
          avatarUrl: comment.user.avatarUrl || '/default-avatar.png'
        } : {
          id: null,
          username: '匿名用户',
          avatarUrl: '/default-avatar.png'
        },
        likes: comment.likes || 0,
        dislikes: comment.dislikes || 0,
        userReaction: userId ? comment.userReactions?.find((r: any) => r.userId.toString() === userId)?.reaction || null : null
      })),
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
      totalComments: result.total
    });
  } catch (error) {
    return errorHandler(error, request);
  }
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
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { commentId } = await req.json();
      const tool = await AITool.findById(params.id);

      if (!tool) {
        return NextResponse.json({ message: 'AI工具不存在' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ message: '评论不存在' }, { status: 404 });
      }

      if (comment.userId.toString() !== userId) {
        return NextResponse.json({ message: '无权删除此评论' }, { status: 403 });
      }

      tool.comments.pull(commentId);
      await tool.save();

      return NextResponse.json({ message: '评论已删除' });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}