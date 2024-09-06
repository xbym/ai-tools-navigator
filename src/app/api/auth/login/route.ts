import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    logger.info('Login attempt');
    await dbConnect();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Login failed: User not found', { email });
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login failed: Incorrect password', { email });
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    logger.info('Login successful', { userId: user._id });
    
    return NextResponse.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    return errorHandler(error, request);
  }
}