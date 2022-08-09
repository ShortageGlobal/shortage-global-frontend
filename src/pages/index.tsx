import Head from 'next/head';
import { wrapper } from 'app/store';
import { fetchPromotedOrganizations } from 'app/store/slices/promoted-organizations';
import {
  fetchPromotedCategories,
  setCurrentCategory,
} from 'app/store/slices/promoted-categories';
import { fetchPromotedProducts } from 'app/store/slices/promoted-products';
import { setSearchQuery } from 'app/store/slices/search';
import { LandingBanner } from 'components/landing-banner/landing-banner';
import { PromotedOrganizations } from 'components/promoted-organizations/promoted-organizations';
import type { NextPageWithLayout } from 'pages/_app';
import type { Category } from 'app/api/types';
import { PRODUCT_CATEGORY_ALL_KEY } from 'app/constants';
import { PromotedProducts } from 'components/promoted-products/promoted-products';

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>ShortageGlobal | Donate tangible goods</title>
      </Head>
      <LandingBanner />
      <PromotedOrganizations />
      <PromotedProducts />
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
      fetchPromotedProducts({ category: currentCategory, search })
    );

    return {
      props: {},
    };
  }
);

export default IndexPage;
