'use client';

<<<<<<< HEAD
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
=======
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface ClientComponentProps {
  children: ReactNode;
}

export default function ClientComponent({ children }: ClientComponentProps) {
  const searchParams = useSearchParams();
  // 如果需要使用 searchParams，可以在这里处理

  return <>{children}</>;
>>>>>>> 8deb8ac4eedb68b765c04c7773d30ee72ae62ee4
}