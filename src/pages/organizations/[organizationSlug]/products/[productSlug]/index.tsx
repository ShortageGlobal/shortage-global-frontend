import Head from 'next/head';
import { wrapper } from 'app/store';
import { fetchProduct } from 'app/store/slices/product';
import type { NextPageWithLayout } from 'pages/_app';
import { useAppSelector } from 'app/hooks';
import { selectProduct } from 'app/store/slices/product';

const ProductPage: NextPageWithLayout = () => {
  const { product } = useAppSelector(selectProduct);
  return (
    <>
      <Head>
        <title>Product | ShortageGlobal</title>
      </Head>
      <div>product page {product.name}</div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;
    const productSlug = context.params.productSlug as string;

    await store.dispatch(fetchProduct({ organizationSlug, productSlug }));

    return {
      props: {},
    };
  }
);

export default ProductPage;
