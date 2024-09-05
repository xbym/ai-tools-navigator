'use client';

import React, { Suspense, ReactNode } from 'react'; // 修改这行
import { useSearchParams } from 'next/navigation';

interface ClientPageProps {
  children: ReactNode;
}

function ClientPageContent({ children }: ClientPageProps) {
  const searchParams = useSearchParams();
  // 如果需要使用 searchParams，可以在这里处理
  return <>{children}</>;
}

export default function ClientPage({ children }: ClientPageProps) {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ClientPageContent>{children}</ClientPageContent>
    </Suspense>
  );
}