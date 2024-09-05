import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log('Connected to database');

    const { email } = await req.json();
    console.log('Received email:', email);

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (user) {
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
      console.log('Reset token saved for user');

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
      console.log('Reset URL:', resetUrl);

      try {
        await sendPasswordResetEmail(user.email, resetUrl, user.username);
        console.log('Reset email sent');
      } catch (emailError: unknown) {
        console.error('Error sending reset email:', emailError);
        return NextResponse.json({ message: 'Error sending reset email' }, { status: 500 });
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link' });
  } catch (error: unknown) {
    console.error('Error in forgot password route:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}