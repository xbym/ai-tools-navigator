'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 处理忘记密码逻辑...
  };

  // 表单内容...

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段... */}
    </form>
  );
}

export default function ForgotPasswordContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}