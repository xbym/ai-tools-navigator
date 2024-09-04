import ErrorLog from '@/models/ErrorLog';
import dbConnect from '@/lib/dbConnect';

export async function logError(
  error: Error,
  req?: any,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  type: 'client' | 'server' = 'server',
  component?: string,
  userId?: string
) {
  await dbConnect();

  const errorLog = new ErrorLog({
    message: error.message,
    stack: error.stack,
    severity,
    type,
    component,
    userId,
    ...(req && {
      url: req.url,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      userAgent: req.headers['user-agent']
    })
  });

  await errorLog.save();
}