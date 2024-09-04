import type { NextApiRequest, NextApiResponse } from 'next';
import { logError } from '@/lib/errorLogger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message, stack, url, userAgent, component } = req.body;
      await logError(
        new Error(message),
        { url, headers: { 'user-agent': userAgent } },
        'medium',
        'client',
        component
      );
      res.status(200).json({ message: 'Error logged successfully' });
    } catch (error) {
      console.error('Error logging client error:', error);
      res.status(500).json({ message: 'Failed to log error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}