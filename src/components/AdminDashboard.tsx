'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const { isAdmin, user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        showToast('获取用户列表失败', 'error');
      }
    } catch (error) {
      showToast('获取用户列表时发生错误', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    if (!isAdmin()) {
      showToast('您没有权限访问此页面', 'error');
      router.push('/');
    } else {
      fetchUsers();
    }
  }, [isAdmin, router, showToast, fetchUsers]);

  if (!isAdmin()) {
    return null;
  }

  return (
    <div>
      <h1>管理员仪表板</h1>
      <h2>用户列表</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user._id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}