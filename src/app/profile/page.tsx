"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>加载中...</p>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">个人资料</h1>
      <p>用户名: {session.user?.name}</p>
      <p>邮箱: {session.user?.email}</p>
      {/* 添加更多用户信息和编辑功能 */}
    </div>
  );
}