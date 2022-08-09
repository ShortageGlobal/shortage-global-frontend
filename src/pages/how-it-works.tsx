import Head from 'next/head';
import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const HowItWorks: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>How it works | ShortageGlobal</title>
      </Head>
      <div>How it works</div>{' '}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default HowItWorks;
