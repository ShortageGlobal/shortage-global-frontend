import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { Edit } from 'react-feather';
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
import {
  fetchAccountOrganizationCampaign,
  selectAccountCampaign,
} from 'core/store/slices/account-campaign';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageCampaignsCrumb,
  getManageCampaignsEditCrumb,
  getManageCampaignsRequestedGoodsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CampaignProductsList } from 'components/manage-nonprofit/campaigns/campaign-products/campaign-products-list';
import type { NextPageWithLayout } from 'pages/_app';

const CampaignRequestedGoodsPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);
  const { campaign } = useAppSelector(selectAccountCampaign);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageCampaignsCrumb({
        organizationSlug: organization.slug,
      }),
      getManageCampaignsEditCrumb({
        organizationSlug: organization.slug,
        campaignUuid: campaign.uuid,
      }),
      getManageCampaignsRequestedGoodsCrumb({
        isActive: true,
        organizationSlug: organization.slug,
        campaignUuid: campaign.uuid,
      }),
    ];
  }, [organization, campaign]);

  return (
    <>
      <Head>
        <title>{`${campaign.name} — Campaign's Requested Goods | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>
              <span>Campaign&apos;s Requested Goods</span>

              <Link
                href={`/private/manage-nonprofit/${organization.slug}/campaigns/${campaign.uuid}/`}
                legacyBehavior
                passHref
              >
                <Button variant="outline-dark" size="lg">
                  <Edit size="1rem" />
                  <span>Edit</span>
                </Button>
              </Link>
            </h2>
          </Col>
        </Row>

        <Row>
          <Col>
            <Alert variant="info" className="mb-4">
              Select the goods you want to see as a part of the{' '}
              <b className={commonStyles.breakWord}>
                &quot;{campaign.name}&quot;
              </b>{' '}
              campaign.
            </Alert>
          </Col>
        </Row>

        <CampaignProductsList />
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
    const campaignUuid = context.params.campaignUuid as string;

    await Promise.all([
      store.dispatch(
        fetchAccountOrganization({ organizationSlug, accessToken })
      ),
      store.dispatch(
        fetchAccountOrganizationCampaign({
          organizationSlug,
          campaignUuid,
          accessToken,
        })
      ),
    ]);

    const { accountOrganization, accountCampaign } = store.getState();

    if (
      accountOrganization.error?.status === 404 ||
      accountCampaign.error?.status === 404
    ) {
      return {
        redirect: {
          destination: '/private/manage-nonprofit/',
          permanent: false,
        },
      };
    }

    if (
      accountOrganization.error?.status === 401 ||
      accountCampaign.error?.status === 401
    ) {
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

CampaignRequestedGoodsPage.getLayout = manageNonprofitLayout;

export default CampaignRequestedGoodsPage;
