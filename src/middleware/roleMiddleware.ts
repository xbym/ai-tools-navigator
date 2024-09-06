import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

// 扩展 NextApiRequest 类型
interface ExtendedNextApiRequest extends NextApiRequest {
  user?: any;
}

export function withRole(role: string) {
  return function(handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>) {
    return async function(req: ExtendedNextApiRequest, res: NextApiResponse) {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== role) {
          return res.status(403).json({ message: '没有权限访问此资源' });
        }

        req.user = user;
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ message: '无效的认证令牌' });
      }
    };
  };
}