import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../src/middleware/authMiddleware';
import User from '../../../src/models/User';
import dbConnect from '../../../src/lib/dbConnect';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const user = (req as any).user;
  res.status(200).json({ user: { id: user._id, username: user.username, email: user.email } });
}

export default withAuth(handler);