'use client';

<<<<<<< HEAD
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
=======
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
>>>>>>> 35606fa0e13de8545a3679d5a797af92108be371

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addTool');
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

<<<<<<< HEAD
=======
  // 使用 isAdmin 作为函数
>>>>>>> 35606fa0e13de8545a3679d5a797af92108be371
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