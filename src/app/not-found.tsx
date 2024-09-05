import Link from 'next/link';
import ClientComponent from '@/components/ClientComponent';

export default function NotFound() {
  return (
    <ClientComponent>
      <div>
        <h2>未找到页面</h2>
        <p>抱歉，您请求的页面不存在。</p>
        <Link href="/">
          返回首页
        </Link>
      </div>
    </ClientComponent>
  );
}