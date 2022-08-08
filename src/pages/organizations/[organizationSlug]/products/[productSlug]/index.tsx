// import { wrapper } from 'app/store';
// import {
//   fetchOrganization,
//   selectOrganization,
// } from 'app/store/slices/organization';
// import { fetchCategories, selectCategories } from 'app/store/slices/categories';
// import { fetchProducts, selectProducts } from 'app/store/slices/products';
import type { NextPageWithLayout } from 'pages/_app';
// import { useAppSelector } from 'app/hooks';

const ProductPage: NextPageWithLayout = () => {
  return <div>product page</div>;
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

export default ProductPage;
