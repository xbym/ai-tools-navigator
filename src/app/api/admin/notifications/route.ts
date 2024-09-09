import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
  return authMiddleware(async (req: NextRequest & { user?: any }) => {
    try {
      await dbConnect();
      const notifications = await Notification.find({}).exec();
      return NextResponse.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
  })(request);
}

export async function PUT(request: NextRequest) {
  return authMiddleware(async (req: NextRequest & { user?: any }) => {
    try {
      await dbConnect();
      const { id } = await req.json();
      const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
      if (!notification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      return NextResponse.json(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
  })(request);
}