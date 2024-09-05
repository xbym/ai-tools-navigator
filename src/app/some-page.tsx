import Layout from '@/components/Layout';
import ClientPage from '@/components/ClientPage';
import SearchParamsHandler from '@/components/SearchParamsHandler';

export default function SomePage() {
  return (
    <Layout title="某页面 - AI工具导航">
      <ClientPage>
        <SearchParamsHandler />
        {/* 如果 SomeContent 不存在,可以删除或替换这行 */}
        {/* <SomeContent /> */}
      </ClientPage>
    </Layout>
  );
}