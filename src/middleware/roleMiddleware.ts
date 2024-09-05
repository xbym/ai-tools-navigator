import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from './authMiddleware';

export function withRole(role: string) {
  return (handler: any) => {
    return withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
      const user = (req as any).user;
      if (user.role !== role) {
        return res.status(403).json({ message: '没有权限访问此资源' });
      }
      return handler(req, res);
    });
  };
}