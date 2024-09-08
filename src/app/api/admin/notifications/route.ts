import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      // @ts-ignore
      const userId = req.user.userId;

      const notifications = await Notification.find({ read: false })
        .populate('toolId', 'name')
        .populate('reporterId', 'username')
        .sort({ createdAt: -1 });

      return NextResponse.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 });
    }
  })(request);
}

export async function PUT(request: NextRequest) {
  return authMiddleware(async (req: NextRequest) => {
    try {
      await dbConnect();
      const { notificationId } = await req.json();
      // @ts-ignore
      const userId = req.user.userId;

      const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
      if (!notification) {
        return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
      }
      return NextResponse.json(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json({ message: 'Error updating notification' }, { status: 500 });
    }
  })(request);
}