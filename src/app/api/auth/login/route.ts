import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { errorHandler } from '@/middleware/errorHandler';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log('MongoDB connected successfully');

    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    // 查找用户
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: '用户不存在' }, { status: 400 });
    }
    console.log('User found:', user.username);

    // 检查密码字段是否存在
    if (!user.password) {
      console.error('User found but password field is missing');
      return NextResponse.json({ message: '用户数据异常' }, { status: 500 });
    }

    // 比较密码
    console.log('About to compare passwords');
    let isMatch;
    try {
      isMatch = await user.comparePassword(password);
    } catch (error) {
      console.error('Error during password comparison:', error);
      return NextResponse.json({ message: '登录过程中出现错误' }, { status: 500 });
    }
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch, returning error response');
      return NextResponse.json({ message: '密码不正确' }, { status: 400 });
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    return NextResponse.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return errorHandler(error, request);
  }
}