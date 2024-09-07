import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/authMiddleware'; // 添加这行
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const tools = await AITool.find({}).select('name description category url tags iconUrl averageRating viewCount');
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ message: 'Error fetching tools' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const data = await req.json();
      const tool = await AITool.create({ ...data, createdBy: userId });
      return NextResponse.json(tool, { status: 201 });
    } catch (error) {
      console.error('Error creating tool:', error);
      return NextResponse.json({ message: 'Error creating tool' }, { status: 500 });
    }
  });
}

// 同样更新 PUT 和 DELETE 方法
export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      logger.info('Updating AI tool');
      await dbConnect();
      const id = req.nextUrl.searchParams.get('id');
      if (!id) {
        return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
      }
      const data = await req.json();
      const tool = await AITool.findOneAndUpdate({ _id: id, createdBy: userId }, data, { new: true });
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found or you do not have permission to update it' }, { status: 404 });
      }
      logger.info('AI tool updated successfully', { toolId: tool._id, userId });
      return NextResponse.json(tool);
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}

export async function DELETE(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      logger.info('Deleting AI tool');
      await dbConnect();
      const id = req.nextUrl.searchParams.get('id');
      if (!id) {
        return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
      }
      const tool = await AITool.findOneAndDelete({ _id: id, createdBy: userId });
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found or you do not have permission to delete it' }, { status: 404 });
      }
      logger.info('AI tool deleted successfully', { toolId: id, userId });
      return NextResponse.json({ message: 'Tool deleted successfully' });
    } catch (error) {
      return errorHandler(error, request);
    }
  });
}

// 同样更新 PUT 和 DELETE 方法