"use client";

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <AdminRoute>
      <Layout title="用户管理 - AI工具导航">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">用户管理</h1>
          <table className="w-full bg-gray-800">
            <thead>
              <tr>
                <th className="p-2 text-left">用户名</th>
                <th className="p-2 text-left">邮箱</th>
                <th className="p-2 text-left">角色</th>
                <th className="p-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button className="text-blue-400 hover:underline mr-2">编辑</button>
                    <button className="text-red-400 hover:underline">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </AdminRoute>
  );
}