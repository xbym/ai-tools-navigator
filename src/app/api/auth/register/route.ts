import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    logger.info('Registration attempt');
    await dbConnect();
    const { username, email, password } = await request.json();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn('Registration failed: User already exists', { email, username });
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    logger.info('Registration successful', { userId: user._id });
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return errorHandler(error, request);
  }
}