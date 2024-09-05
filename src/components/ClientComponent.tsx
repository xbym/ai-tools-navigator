'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

interface ClientComponentProps {
  children: ReactNode;
}

export default function ClientComponent({ children }: ClientComponentProps) {
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<div>加载中...</div>}>
      {children}
    </Suspense>
  );
}