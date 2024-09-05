import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export function authMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse<any>>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (req as any).user = decoded;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}