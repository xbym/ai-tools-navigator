import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import Layout from "../components/Layout";

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
    <html lang="zh" className="dark">
      <body className="bg-gray-900 text-gray-100">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
