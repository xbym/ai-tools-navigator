import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { id: toolId, commentId } = params;
      const { reaction } = await req.json();

      const tool = await AITool.findById(toolId);
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
      }

      const comment = tool.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      // 确保 userReactions 存在
      if (!comment.userReactions) {
        comment.userReactions = [];
      }

      // 检查用户之前的反应
      const userReactionIndex = comment.userReactions.findIndex(
        (r: any) => r.userId.toString() === userId
      );

      if (userReactionIndex > -1) {
        const prevReaction = comment.userReactions[userReactionIndex].reaction;
        if (prevReaction === reaction) {
          // 如果用户再次点击相同的反应,则移除反应
          comment.userReactions.splice(userReactionIndex, 1);
          comment[`${reaction}s`]--;
        } else {
          // 更改反应
          comment.userReactions[userReactionIndex].reaction = reaction;
          comment[`${prevReaction}s`]--;
          comment[`${reaction}s`]++;
        }
      } else {
        // 添加新的反应
        comment.userReactions.push({ userId, reaction });
        comment[`${reaction}s`]++;
      }

      await tool.save();

      return NextResponse.json({
        likes: comment.likes,
        dislikes: comment.dislikes,
        userReaction: reaction,
      });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}