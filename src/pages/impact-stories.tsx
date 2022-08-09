import Head from 'next/head';
import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const ImpactStories: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Impact stories | ShortageGlobal</title>
      </Head>
      <div>Impact stories</div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ImpactStories;
