import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, newPassword } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    console.log('Password reset successful');
    console.log('New hashed password:', hashedPassword);

    return NextResponse.json({ message: '密码已重置' }, { status: 200 });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ message: '密码重置失败' }, { status: 500 });
  }
}