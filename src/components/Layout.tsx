'use client';

import React, { Suspense } from 'react';
import Head from 'next/head';
import { NavMenu } from './NavMenu';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = 'AI工具导航', description }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <header className="bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <NavMenu />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>加载中...</div>}>
          {children}
        </Suspense>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 AI工具导航. All rights reserved.</p>
      </footer>
    </div>
  );
}