'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface ClientComponentProps {
  children: ReactNode;
}

export default function ClientComponent({ children }: ClientComponentProps) {
  const searchParams = useSearchParams();
  // 如果需要使用 searchParams，可以在这里处理

  return <>{children}</>;
}