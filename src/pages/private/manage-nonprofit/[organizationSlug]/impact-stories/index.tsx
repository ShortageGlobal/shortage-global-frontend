import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Plus } from 'react-feather';
import Head from 'next/head';
import Link from 'next/link';
import { manageNonprofitLayout } from 'core/layouts';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchAccountOrganization,
  selectAccountOrganization,
} from 'core/store/slices/account-organization';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageImpactStoriesCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { BlogPostsList } from 'components/manage-nonprofit/blog-posts/blog-posts-list';
import type { NextPageWithLayout } from 'pages/_app';

const ImpactStoriesPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageImpactStoriesCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Impact Stories | Shortage`}</title>
      </Head>
      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col as="h2" md={7} className={commonStyles.title}>
            Impact Stories
          </Col>

          <Col xs="auto" className={commonStyles.actions}>
            <Link
              href={{
                pathname:
                  '/private/manage-nonprofit/[organizationSlug]/impact-stories/create',
                query: {
                  organizationSlug: organization.slug,
                },
              }}
              passHref
              legacyBehavior
            >
              <Button size="lg">
                <Plus />
                <span>Add new</span>
              </Button>
            </Link>
          </Col>
        </Row>

        <BlogPostsList />
      </div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;

    await store.dispatch(
      fetchAccountOrganization({ organizationSlug, accessToken })
    );

    const { accountOrganization } = store.getState();

    if (accountOrganization.error?.status === 404) {
      return {
        redirect: {
          destination: '/private/manage-nonprofit/',
          permanent: false,
        },
      };
    }

    if (accountOrganization.error?.status === 401) {
      const callbackUrl = encodeURIComponent(context.resolvedUrl);
      return {
        redirect: {
          destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

ImpactStoriesPage.getLayout = manageNonprofitLayout;

export default ImpactStoriesPage;
