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

export async function authMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      logger.warn('No token provided in request');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    logger.debug(`Received token: ${token}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    logger.debug(`Decoded userId: ${decoded.userId}`);

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      logger.error(`Invalid userId in token: ${decoded.userId}`);
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 401 });
    }
    return handler(request, decoded.userId);
  } catch (error) {
    logger.error('Error in authMiddleware:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}