import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
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
  getManageCampaignsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CampaignsList } from 'components/manage-nonprofit/campaigns/campaigns-list';
import type { NextPageWithLayout } from 'pages/_app';

const CampaignsPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageCampaignsCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Campaigns | Shortage`}</title>
      </Head>
      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col as="h2" md={7} className={commonStyles.title}>
            Campaigns
          </Col>

          <Col xs="auto" className={commonStyles.actions}>
            <Link
              href={{
                pathname:
                  '/private/manage-nonprofit/[organizationSlug]/campaigns/create',
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

        <Row>
          <Col>
            <Alert variant="info" className="mb-4">
              Campaigns help to raise donations for specific cause. Each
              campaign has its own page, list of products, and delivery
              instructions.
            </Alert>
          </Col>
        </Row>

        <CampaignsList />
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

CampaignsPage.getLayout = manageNonprofitLayout;

export default CampaignsPage;
