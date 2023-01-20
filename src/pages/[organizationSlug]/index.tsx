import styles from 'styles/pages/organization.module.scss';
import { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import {
  fetchOrganization,
  selectOrganization,
} from 'core/store/slices/organization';
import {
  fetchCategories,
  setCurrentCategory,
} from 'core/store/slices/categories';
import { fetchProducts } from 'core/store/slices/products';
import {
  fetchOrganizationBlogPosts,
  selectOrganizationBlogPosts,
} from 'core/store/slices/organization-blog-posts';
import { setSearchQuery } from 'core/store/slices/search';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { OrganizationDetails } from 'components/organization/details/details';
import { DonationSteps } from 'components/donation-steps/donation-steps';
import { OrganizationProducts } from 'components/organization/products/products';
import { OrganizationBlogPosts } from 'components/organization/blog-posts/blog-posts';
import { PromoSocialMedia } from 'components/promo-social-media/promo-social-media';
import {
  ROOT_URL,
  PRODUCT_CATEGORY_ALL_KEY,
  PRODUCTS_PAGE_SIZE,
  BLOG_POSTS_PAGE_SIZE,
} from 'core/constants';
import type { Category } from 'core/api/types';
import type { NextPageWithLayout } from 'pages/_app';

const OrganizationPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectOrganization);
  const { organizationBlogPosts } = useAppSelector(selectOrganizationBlogPosts);

  const { metaUrl, metaTitle, metaDescription, metaImage } = useMemo(() => {
    return {
      metaUrl: `${ROOT_URL}/${organization.slug}/`,
      metaTitle: `Make an in-kind gift to ${organization.name}`,
      metaDescription: organization.meta_description?.trim()
        ? organization.meta_description.trim()
        : null,
      metaImage: organization.banner,
    };
  }, [organization]);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
        isActive: true,
      }),
    ];
  }, [organization]);

  // track page view
  useEffect(() => {
    gtm.trackOrganizationView({
      organizationSlug: organization.slug,
      organizationName: organization.name,
    });
  }, []);

  return (
    <>
      <Head>
        <title>{`${organization.name} | Shortage`}</title>
        <meta property="og:url" key="og:url" content={metaUrl} />
        <meta property="og:title" key="og:title" content={metaTitle} />
        {metaDescription ? (
          <>
            <meta
              property="og:description"
              key="og:description"
              content={metaDescription}
            />
            <meta
              property="description"
              key="description"
              content={metaDescription}
            />
          </>
        ) : null}
        {metaImage ? (
          <>
            <meta property="og:image" key="og:image" content={metaImage} />
            <meta
              property="og:image:width"
              key="og:image:width"
              content="1200"
            />
            <meta
              property="og:image:height"
              key="og:image:height"
              content="700"
            />
          </>
        ) : null}
      </Head>

      <Container className={styles.organization}>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <OrganizationDetails />

      <DonationSteps />

      <OrganizationProducts />

      {organizationBlogPosts?.length > 0 ? <OrganizationBlogPosts /> : null}

      <PromoSocialMedia />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug })),
      store.dispatch(fetchCategories({ organizationSlug })),
      store.dispatch(
        fetchOrganizationBlogPosts({
          organizationSlug,
          limit: BLOG_POSTS_PAGE_SIZE,
        })
      ),
    ]);

    const { organization } = store.getState();

    if (organization.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    // try to extract category from query parameters
    const { categories } = store.getState().categories;
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
      fetchProducts({
        organizationSlug,
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

export default OrganizationPage;
