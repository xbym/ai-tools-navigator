import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { logger } from '@/utils/logger';
import mongoose from 'mongoose';
import { verifyToken } from '@/utils/auth'; // 确保路径正确

export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: '用户不存在' });
      }

      (req as any).user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: '无效的认证令牌' });
    }
  };
}

export function authMiddleware(handler: (req: NextRequest & { user?: any }) => Promise<NextResponse<any>>) {
  return async (request: NextRequest) => {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const user = await verifyToken(token);
      if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      // @ts-ignore
      request.user = user;
      return handler(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  };
}