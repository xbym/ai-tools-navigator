import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import dynamic from 'next/dynamic';

const ClientErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), { ssr: false });

export const metadata: Metadata = {
  title: "AI工具导航",
  description: "发现和探索各种AI工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <ClientErrorBoundary>
          <NextAuthProvider>{children}</NextAuthProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
