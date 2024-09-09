import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { errorHandler } from '@/middleware/errorHandler'; // 添加这行
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';

interface AuthUser {
  _id: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const tools = await AITool.find({}).select('name description category url tags iconUrl averageRating viewCount comments');
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ message: 'Error fetching tools' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return authMiddleware(async (authReq: NextRequest & { user?: AuthUser }) => {
    try {
      await dbConnect();
      const user = authReq.user;

      if (!user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
      }

      const body = await authReq.json();
      const { name, description, category, url, tags, iconUrl, screenshotUrl } = body;

      // 验证必填字段
      if (!name || !description || !category || !url) {
        return NextResponse.json({ error: '缺少必要的字段' }, { status: 400 });
      }

      const newTool = new AITool({
        name,
        description,
        category,
        url,
        tags: tags || [],
        iconUrl: iconUrl || "/icons/placeholder.svg",
        screenshotUrl,
        ratings: [],
        comments: [],
        viewCount: 0,
        averageRating: 0,
        createdBy: user._id,
      });

      await newTool.save();

      return NextResponse.json({ message: '工具添加成功', tool: newTool }, { status: 201 });
    } catch (error) {
      console.error('添加工具时出错:', error);
      return NextResponse.json({ error: '添加工具时出错' }, { status: 500 });
    }
  })(req);
}

// 同样更新 PUT 和 DELETE 方法
export async function PUT(request: NextRequest) {
  return authMiddleware(async (authReq: NextRequest & { user?: AuthUser }) => {
    try {
      const user = authReq.user;

      if (!user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
      }

      logger.info('Updating AI tool');
      await dbConnect();
      const id = authReq.nextUrl.searchParams.get('id');
      if (!id) {
        return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
      }
      const data = await authReq.json();
      const tool = await AITool.findOneAndUpdate({ _id: id, createdBy: user._id }, data, { new: true });
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found or you do not have permission to update it' }, { status: 404 });
      }
      logger.info('AI tool updated successfully', { toolId: tool._id, userId: user._id });
      return NextResponse.json(tool);
    } catch (error) {
      return errorHandler(error, request);
    }
  })(request);
}

export async function DELETE(request: NextRequest) {
  return authMiddleware(async (authReq: NextRequest & { user?: AuthUser }) => {
    try {
      const user = authReq.user;

      if (!user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
      }

      logger.info('Deleting AI tool');
      await dbConnect();
      const id = authReq.nextUrl.searchParams.get('id');
      if (!id) {
        return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
      }
      const tool = await AITool.findOneAndDelete({ _id: id, createdBy: user._id });
      if (!tool) {
        return NextResponse.json({ message: 'Tool not found or you do not have permission to delete it' }, { status: 404 });
      }
      logger.info('AI tool deleted successfully', { toolId: id, userId: user._id });
      return NextResponse.json({ message: 'Tool deleted successfully' });
    } catch (error) {
      return errorHandler(error, request);
    }
  })(request);
}

// 同样更新 PUT 和 DELETE 方法