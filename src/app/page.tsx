import Meta from '../components/Meta';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const AIToolListWrapperClient = dynamic(
  () => import('../components/AIToolListWrapper'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Meta 
        title="AI导航站 - 发现最佳AI工具"
        description="探索和发现最新、最强大的AI工具。我们的AI导航站为您提供全面的AI工具列表，帮助您提高工作效率。"
        keywords="AI工具, 人工智能, 导航站, 效率工具, 机器学习"
      />
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AI导航站",
            "description": "探索和发现最新、最强大的AI工具",
            "url": "https://your-domain.com"
          }
        `}
      </Script>
      <main className="flex min-h-screen flex-col items-center py-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-8 text-center">AI导航站</h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-center">欢迎来到AI工具导航</p>
        <AIToolListWrapperClient />
      </main>
    </>
  )
}