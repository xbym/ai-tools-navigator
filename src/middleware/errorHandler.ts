import { NextRequest, NextResponse } from 'next/server';

export function errorHandler(error: unknown, request: NextRequest) {
  console.error('API Error', error);
  
  if (error instanceof Error) {
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
}