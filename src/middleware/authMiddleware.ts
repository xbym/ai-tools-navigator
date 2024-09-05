import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

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

export function withAdminAuth(handler: any) {
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

      if (user.role !== 'admin') {
        return res.status(403).json({ message: '没有权限访问此资源' });
      }

      (req as any).user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: '无效的认证令牌' });
    }
  };
}