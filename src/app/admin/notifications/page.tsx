"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Notification {
  _id: string;
  type: string;
  toolId: { _id: string; name: string };
  commentId: string;
  reporterId: { _id: string; username: string };
  createdAt: string;
  read: boolean;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { token } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      });
      if (response.ok) {
        setNotifications(notifications.filter(n => n._id !== notificationId));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <AdminRoute>
      <Layout title="通知管理 - AI工具导航">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">通知管理</h1>
          {notifications.length === 0 ? (
            <p>没有新的通知</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification._id} className="bg-gray-800 p-4 rounded-lg">
                  <p>类型: {notification.type === 'comment_report' ? '评论举报' : '未知'}</p>
                  <p>工具: <Link href={`/tool/${notification.toolId._id}`} className="text-blue-400 hover:underline">{notification.toolId.name}</Link></p>
                  <p>举报者: {notification.reporterId.username}</p>
                  <p>时间: {new Date(notification.createdAt).toLocaleString()}</p>
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    标记为已读
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Layout>
    </AdminRoute>
  );
}