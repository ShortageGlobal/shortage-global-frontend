import Head from 'next/head';
import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const ForCorporate: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>For corporate | ShortageGlobal</title>
      </Head>
      <div>For corporate</div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ForCorporate;
