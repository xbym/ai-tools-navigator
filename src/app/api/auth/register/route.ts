import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { errorHandler } from '@/middleware/errorHandler';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log('MongoDB connected successfully');

    const { username, email, password } = await request.json();
    console.log('Registration attempt for:', username, email);

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ message: '用户名或邮箱已存在' }, { status: 400 });
    }

    // 创建新用户 (密码将在 User 模型的 pre('save') 钩子中自动哈希)
    const user = await User.create({ username, email, password });
    console.log('User created with hashed password:', user.password);

    // 立即从数据库中检索用户信息
    const savedUser = await User.findOne({ email }).select('+password');
    console.log('Saved user info:', savedUser);
    console.log('Saved hashed password:', savedUser?.password);

    console.log('User registered successfully:', user.username);
    return NextResponse.json({ message: '注册成功', userId: user._id }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return errorHandler(error, request);
  }
}