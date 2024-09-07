import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const notifications = await Notification.find({ read: false })
        .sort({ createdAt: -1 })
        .populate('toolId', 'name')
        .populate('reporterId', 'username');
      return NextResponse.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 });
    }
  });
}

export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (req: NextRequest, userId: string) => {
    try {
      await dbConnect();
      const { notificationId } = await req.json();
      const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
      if (!notification) {
        return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
      }
      return NextResponse.json(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json({ message: 'Error updating notification' }, { status: 500 });
    }
  });
}