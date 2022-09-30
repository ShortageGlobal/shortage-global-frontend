import Head from 'next/head';
import { wrapper } from 'app/store';
import { fetchPromotedOrganizations } from 'app/store/slices/promoted-organizations';
import {
  fetchPromotedCategories,
  setCurrentCategory,
} from 'app/store/slices/promoted-categories';
import { fetchPromotedProducts } from 'app/store/slices/promoted-products';
import { setSearchQuery } from 'app/store/slices/search';
import { PromoBanner } from 'components/promo-banner/promo-banner';
import { PromotedOrganizations } from 'components/promoted-organizations/promoted-organizations';
import { PromotedProducts } from 'components/promoted-products/promoted-products';
import { PRODUCT_CATEGORY_ALL_KEY, PRODUCTS_PAGE_SIZE } from 'app/constants';
import type { Category } from 'app/api/types';
import type { NextPageWithLayout } from 'pages/_app';

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Shortage | Donate tangible goods</title>
      </Head>
      <PromoBanner />
      <PromotedProducts />
      <PromotedOrganizations />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // fetch organizations and categories
    await Promise.all([
      store.dispatch(fetchPromotedOrganizations()),
      store.dispatch(fetchPromotedCategories()),
    ]);

    // try to extract category from query parameters
    const { categories } = store.getState().promotedCategories;
    const categoryQuery = context.query.category as Category;
    const currentCategory = categories.includes(categoryQuery)
      ? categoryQuery
      : PRODUCT_CATEGORY_ALL_KEY;
    store.dispatch(setCurrentCategory(currentCategory));

    // try to extract search from query parameters
    let search = context.query.search;
    if (typeof search !== 'string') {
      search = '';
    }
    store.dispatch(setSearchQuery(search));

    // fetch products
    await store.dispatch(
      fetchPromotedProducts({
        category: currentCategory,
        search,
        limit: PRODUCTS_PAGE_SIZE,
      })
    );

    return {
      props: {},
    };
  }
);

export default IndexPage;
