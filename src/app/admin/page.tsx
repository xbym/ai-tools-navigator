"use client";

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [tools, setTools] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
      fetchTools();
      fetchReportedComments();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const fetchReportedComments = async () => {
    try {
      const response = await fetch('/api/admin/reported-comments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReportedComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching reported comments:', error);
    }
  };

  return (
    <AdminRoute>
      <Layout title="管理面板 - AI工具导航">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">管理面板</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">用户管理</h2>
              <p>总用户数: {users.length}</p>
              <Link href="/admin/users" className="text-blue-400 hover:underline">
                查看所有用户
              </Link>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">AI工具管理</h2>
              <p>总工具数: {tools.length}</p>
              <Link href="/admin/tools" className="text-blue-400 hover:underline">
                管理AI工具
              </Link>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">评论管理</h2>
              <p>被举报评论: {reportedComments.length}</p>
              <Link href="/admin/reported-comments" className="text-blue-400 hover:underline">
                处理被举报评论
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </AdminRoute>
  );
}