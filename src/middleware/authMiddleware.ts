import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { logger } from '@/utils/logger';
import mongoose from 'mongoose';

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

export function authMiddleware(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      
      if (!token) {
        logger.warn('No token provided');
        return NextResponse.json({ message: '未提供认证令牌' }, { status: 401 });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        // @ts-ignore
        req.user = decoded;
      } catch (error) {
        logger.error('Error verifying JWT:', error);
        return NextResponse.json({ message: '无效的认证令牌' }, { status: 401 });
      }

      return handler(req, ...args);
    } catch (error) {
      logger.error('Error in authMiddleware:', error);
      return NextResponse.json({ message: '服务器错误' }, { status: 500 });
    }
  };
}