import Head from 'next/head';
import { wrapper } from 'core/store';
import { fetchPromotedOrganizations } from 'core/store/slices/promoted-organizations';
import {
  fetchPromotedCategories,
  setCurrentCategory,
} from 'core/store/slices/promoted-categories';
import { fetchPromotedProducts } from 'core/store/slices/promoted-products';
import { setSearchQuery } from 'core/store/slices/search';
import { PromoBanner } from 'components/promo-banner/promo-banner';
import { PromoCampaign } from 'components/promo-campaign/promo-campaign';
import { DonationSteps } from 'components/donation-steps/donation-steps';
import { PromotedProducts } from 'components/promoted-products/promoted-products';
// import { PromotedOrganizations } from 'components/promoted-organizations/promoted-organizations';
import { PromoFeedback } from 'components/promo-feedback/promo-feedback';
import { PRODUCT_CATEGORY_ALL_KEY, PRODUCTS_PAGE_SIZE } from 'core/constants';
import type { Category } from 'core/api/types';
import type { NextPageWithLayout } from 'pages/_app';

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Shortage | Donate tangible goods</title>
      </Head>
      <PromoBanner />
      <PromoCampaign
        text="JFCS toy and book drive"
        background="/images/promo-campaigns/jfcs_banner.png"
      />
      <DonationSteps />
      <PromotedProducts />
      {/* <PromotedOrganizations /> */}
      <PromoFeedback />
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
    const currentCategory = categories?.includes(categoryQuery)
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
