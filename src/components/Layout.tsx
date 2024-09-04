import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { NavMenu } from './NavMenu';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = 'AI工具导航', description = '发现和探索最新最酷的AI工具' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <header className="bg-gray-800 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            AI工具导航
          </Link>
          <NavMenu />
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-center py-4">
        <p>&copy; 2024 AI工具导航. All rights reserved.</p>
      </footer>
    </div>
  );
}