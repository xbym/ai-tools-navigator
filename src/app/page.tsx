import AIToolListWrapper from '../components/AIToolListWrapper';
import Link from 'next/link';
import CloudinaryCheck from '../components/CloudinaryCheck';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CloudinaryCheck />
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">AI工具导航</h1>
        <p className="text-xl text-gray-400">发现和探索最新最酷的AI工具</p>
      </header>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">所有工具</h2>
        <AIToolListWrapper />
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/submit-tool" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300">
          提交新工具
        </Link>
      </div>
    </div>
  );
}