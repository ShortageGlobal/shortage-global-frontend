import styles from 'styles/pages/organization.module.scss';
import { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchOrganization,
  selectOrganization,
} from 'core/store/slices/organization';
import { fetchCampaign, selectCampaign } from 'core/store/slices/campaign';
import {
  fetchCampaignCategories,
  setCurrentCampaignCategory,
} from 'core/store/slices/campaign-categories';
import { fetchCampaignProducts } from 'core/store/slices/campaign-products';
import {
  fetchOrganizationBlogPosts,
  selectOrganizationBlogPosts,
} from 'core/store/slices/organization-blog-posts';
import { setSearchQuery } from 'core/store/slices/search';
import { DraftWarning } from 'components/draft-warning/draft-warning';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getCampaignCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CampaignDetails } from 'components/organization/campaigns/details/details';
import { DonationSteps } from 'components/donation-steps/donation-steps';
import { CampaignProducts } from 'components/organization/campaigns/products/products';
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

const CampaignPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectOrganization);
  const { campaign } = useAppSelector(selectCampaign);
  const { organizationBlogPosts } = useAppSelector(selectOrganizationBlogPosts);

  const { metaUrl, metaTitle, metaDescription, metaImage } = useMemo(() => {
    if (!organization) {
      return {};
    }
    return {
      metaUrl: `${ROOT_URL}/${organization.slug}/campaigns/${campaign.slug}/${campaign.uuid}/`,
      metaTitle: `Make an in-kind gift to ${organization.name}. Support the "${campaign.name}" campaign`,
      metaDescription: campaign.meta_description?.trim()
        ? campaign.meta_description.trim()
        : organization.meta_description?.trim()
        ? organization.meta_description.trim()
        : null,
      metaImage: campaign.banner,
    };
  }, [organization, campaign]);

  const breadcrumbs = useMemo(() => {
    if (!organization) {
      return [];
    }
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getCampaignCrumb({
        organizationSlug: organization.slug,
        campaignSlug: campaign.slug,
        campaignUuid: campaign.uuid,
        campaignName: campaign.name,
        isActive: true,
      }),
    ];
  }, [organization, campaign]);

  // track page view
  useEffect(() => {
    if (!organization || !campaign) {
      return;
    }
    gtm.trackCampaignView({
      organizationSlug: organization.slug,
      organizationName: organization.name,
      campaignSlug: campaign.slug,
      campaignUuid: campaign.uuid,
      campaignName: campaign.name,
    });
  }, [
    organization?.slug,
    organization?.name,
    campaign?.slug,
    campaign?.name,
    campaign?.uuid,
  ]);

  return (
    <>
      <Head>
        <title>{`${campaign.name} | ${organization.name} | Shortage`}</title>
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

      {organization?.is_draft || !organization?.is_verified ? (
        <DraftWarning
          adminHref={{
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/campaigns/[campaignUuid]/',
            query: {
              organizationSlug: organization?.slug,
              campaignUuid: campaign?.uuid,
            },
          }}
        />
      ) : null}

      <Container className={styles.organization}>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <CampaignDetails />

      <DonationSteps />

      <CampaignProducts />

      {organizationBlogPosts?.length > 0 ? <OrganizationBlogPosts /> : null}

      <PromoSocialMedia />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;
    const campaignSlug = context.params.campaignSlug as string;
    const campaignUuid = context.params.campaignUuid as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug, accessToken })),
      store.dispatch(
        fetchCampaign({
          organizationSlug,
          campaignSlug,
          campaignUuid,
          accessToken,
        })
      ),
      store.dispatch(
        fetchCampaignCategories({
          organizationSlug,
          campaignSlug,
          campaignUuid,
          accessToken,
        })
      ),
      store.dispatch(
        fetchOrganizationBlogPosts({
          organizationSlug,
          limit: BLOG_POSTS_PAGE_SIZE,
          accessToken,
        })
      ),
    ]);

    const { organization, campaign } = store.getState();

    if (organization.error?.status === 404 || campaign.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    // try to extract category from query parameters
    const { campaignCategories } = store.getState().campaignCategories;
    const categoryQuery = context.query.category as Category;
    const currentCategory = campaignCategories?.includes(categoryQuery)
      ? categoryQuery
      : PRODUCT_CATEGORY_ALL_KEY;
    store.dispatch(setCurrentCampaignCategory(currentCategory));

    // try to extract search from query parameters
    let search = context.query.search;
    if (typeof search !== 'string') {
      search = '';
    }
    store.dispatch(setSearchQuery(search));

    // fetch products
    await store.dispatch(
      fetchCampaignProducts({
        organizationSlug,
        campaignSlug,
        campaignUuid,
        category: currentCategory,
        search,
        limit: PRODUCTS_PAGE_SIZE,
        accessToken,
      })
    );

    return {
      props: {},
    };
  }
);

export default CampaignPage;
