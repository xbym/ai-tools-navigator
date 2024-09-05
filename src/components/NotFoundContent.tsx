import Link from 'next/link';

export default function NotFoundContent() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
      <p className="mb-4">抱歉，您请求的页面不存在。</p>
      <Link href="/" className="text-blue-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
}