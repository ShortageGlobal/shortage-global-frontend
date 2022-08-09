import Head from 'next/head';
// import { wrapper } from 'app/store';
// import {
//   fetchOrganization,
//   selectOrganization,
// } from 'app/store/slices/organization';
// import { fetchCategories, selectCategories } from 'app/store/slices/categories';
// import { fetchProducts, selectProducts } from 'app/store/slices/products';
import type { NextPageWithLayout } from 'pages/_app';
// import { useAppSelector } from 'app/hooks';

const OrganizationPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Organization | ShortageGlobal</title>
      </Head>
      <div>organization page</div>
    </>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async () => {
//     await Promise.all([
//       store.dispatch(fetchOrganization()),
//       store.dispatch(fetchCategories()),
//       store.dispatch(fetchProducts()),
//     ]);
//     return {
//       props: {},
//     };
//   }
// );

export default OrganizationPage;
