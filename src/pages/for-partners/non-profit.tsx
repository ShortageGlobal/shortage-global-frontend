import Head from 'next/head';
import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const ForNonProfit: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>For non-profit | ShortageGlobal</title>
      </Head>
      <div>For non-profit</div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ForNonProfit;
