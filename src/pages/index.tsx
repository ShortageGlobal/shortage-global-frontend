import Head from 'next/head';
import { useAppSelector } from 'core/hooks';
import { wrapper } from 'core/store';
// import { fetchPromotedOrganizations } from 'core/store/slices/promoted-organizations';
import {
  fetchPromotedCategories,
  setCurrentCategory,
} from 'core/store/slices/promoted-categories';
import { fetchPromotedProducts } from 'core/store/slices/promoted-products';
import {
  fetchPromotedBlogPosts,
  selectPromotedBlogPosts,
} from 'core/store/slices/promoted-blog-posts';
import { setSearchQuery } from 'core/store/slices/search';
import { StandWithUkraine } from 'components/stand-with-ukraine/stand-with-ukraine';
import { PromoBanner } from 'components/promo-banner/promo-banner';
import { PromoCampaign } from 'components/promo-campaign/promo-campaign';
import { DonationSteps } from 'components/donation-steps/donation-steps';
import { PromotedProducts } from 'components/promoted-products/promoted-products';
import { PromotedBlogPosts } from 'components/promoted-blog-posts/promoted-blog-posts';
// import { PromotedOrganizations } from 'components/promoted-organizations/promoted-organizations';
import { PromoFeedback } from 'components/promo-feedback/promo-feedback';
import { PromoSocialMedia } from 'components/promo-social-media/promo-social-media';
import { PRODUCT_CATEGORY_ALL_KEY, BLOG_POSTS_PAGE_SIZE } from 'core/constants';
import type { Category } from 'core/api/types';
import type { NextPageWithLayout } from 'pages/_app';

const IndexPage: NextPageWithLayout = () => {
  const { promotedBlogPosts } = useAppSelector(selectPromotedBlogPosts);

  return (
    <>
      <Head>
        <title>Shortage | Donate tangible goods</title>
      </Head>

      <StandWithUkraine />
      <PromoBanner />
      <PromoCampaign
        text="JFCS toy and book drive"
        background="/images/promo-campaigns/jfcs_banner.png"
      />
      <DonationSteps />
      <PromotedProducts />
      {/* <PromotedOrganizations /> */}
      <PromoFeedback />
      {promotedBlogPosts?.length > 0 ? <PromotedBlogPosts /> : null}
      <PromoSocialMedia />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // fetch organizations and categories
    await Promise.all([
      // store.dispatch(fetchPromotedOrganizations()),
      store.dispatch(fetchPromotedCategories()),
      store.dispatch(fetchPromotedBlogPosts({ limit: BLOG_POSTS_PAGE_SIZE })),
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
        limit: BLOG_POSTS_PAGE_SIZE,
      })
    );

    return {
      props: {},
    };
  }
);

export default IndexPage;
