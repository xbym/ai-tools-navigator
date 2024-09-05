import { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/middleware/authMiddleware';
import User from '@/models/User';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await User.find({}).select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: '获取用户列表失败' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAdminAuth(handler);