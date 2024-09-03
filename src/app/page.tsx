import dynamic from 'next/dynamic';

const AIToolListWrapperClient = dynamic(
  () => import('../components/AIToolListWrapper'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-8 text-center">AI导航站</h1>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-center">欢迎来到AI工具导航</p>
      <AIToolListWrapperClient />
    </main>
  )
}