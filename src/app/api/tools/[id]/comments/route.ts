import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import mongoose from 'mongoose';  // 添加这行
import { logger } from '@/utils/logger';  // 添加这行
import jwt from 'jsonwebtoken';  // 添加这行
import { Comment, Reply } from '@/types/AITool'; // 导入类型

// 添加这个类型声明
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
  }
}

// 定义评论的接口
interface IComment extends Omit<Comment, 'user' | 'replies'> {
  user: mongoose.Types.ObjectId | { _id: string; username: string; avatarUrl: string };
  replies: IReply[];
  toObject(): any;
}

// 定义用户文档的接口
interface IUser {
  _id: mongoose.Types.ObjectId;  // 修改这行
  username: string;
}

// 定义回复的接口
interface IReply extends Omit<Reply, 'userId'> {
  userId: mongoose.Types.ObjectId | { _id: string; username: string; avatarUrl: string };
  toObject(): any;
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
  await dbConnect();
  const toolId = params.id;
  const tool = await AITool.findById(toolId).populate({
    path: 'comments',
    populate: [
      { path: 'userId', select: 'username avatarUrl' },
      { 
        path: 'replies',
        populate: { path: 'userId', select: 'username avatarUrl' }
      }
    ]
  });

  if (!tool) {
    return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
  }

  const comments = tool.comments.map((comment: any) => {
    const commentObj = comment.toObject();
    return {
      ...commentObj,
      user: {
        id: commentObj.userId?._id || commentObj.userId,
        username: commentObj.userId?.username || 'Anonymous',
        avatarUrl: commentObj.userId?.avatarUrl || '/default-avatar.png'
      },
      replies: (commentObj.replies || []).map((reply: any) => {
        const replyObj = reply.toObject ? reply.toObject() : reply;
        return {
          ...replyObj,
          userId: replyObj.userId?._id || replyObj.userId,
          username: replyObj.userId?.username || 'Anonymous',
          avatarUrl: replyObj.userId?.avatarUrl || '/default-avatar.png'
        };
      })
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