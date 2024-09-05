import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../src/middleware/authMiddleware';
import User from '../../../src/models/User';
import dbConnect from '../../../src/lib/dbConnect';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  await dbConnect();

  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user data' });
  }
}

export default authMiddleware(handler);