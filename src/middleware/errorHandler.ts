import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export function errorHandler(error: unknown, req: NextRequest) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error('API Error', {
    message: errorMessage,
    url: req.url,
    method: req.method,
  });

  return NextResponse.json(
    { error: 'Internal Server Error', message: errorMessage },
    { status: 500 }
  );
}