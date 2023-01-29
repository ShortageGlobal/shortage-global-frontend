import Head from 'next/head';
import { wrapper } from 'core/store';

import type { NextPageWithLayout } from 'pages/_app';

const ManageNonprofitPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Manage Nonprofit | Shortage</title>
      </Head>

      <div>TBD</div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ManageNonprofitPage;
