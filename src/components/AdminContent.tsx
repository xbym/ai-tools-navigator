'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addTool');
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isAuthenticated || !isAdmin()) {
    // 重定向逻辑
    return null;
  }

  // 管理员面板内容...

  return (
    <div>
      {/* 管理员面板UI... */}
    </div>
  );
}

export default function AdminContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}