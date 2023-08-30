import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo, useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { Eye, Settings, Trash2 } from 'react-feather';
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
} from 'components/breadcrumbs/breadcrumbs';
import { CampaignForm } from 'components/manage-nonprofit/campaigns/campaign-form/campaign-form';
import { CampaignConfirmDeleteModal } from 'components/manage-nonprofit/campaigns/campaign-confirm-delete-modal/campaign-confirm-delete-modal';
import type { NextPageWithLayout } from 'pages/_app';

const CampaignEditPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);
  const { campaign } = useAppSelector(selectAccountCampaign);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

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
        isActive: true,
        organizationSlug: organization.slug,
        campaignUuid: campaign.uuid,
      }),
    ];
  }, [organization, campaign]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Edit Campaign | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>
              <span>Edit Campaign</span>

              <Dropdown>
                <Dropdown.Toggle variant="outline">
                  <Settings />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Link
                    href={{
                      pathname:
                        '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]/',
                      query: {
                        organizationSlug: organization.slug,
                        campaignSlug: campaign.slug,
                        campaignUuid: campaign.uuid,
                      },
                    }}
                    passHref
                    legacyBehavior
                  >
                    <Dropdown.Item className={commonStyles.dropdownItem}>
                      <Eye size="1rem" />
                      <span>Preview</span>
                    </Dropdown.Item>
                  </Link>

                  <Dropdown.Divider />

                  <Dropdown.Item
                    as="button"
                    className={classNames(
                      commonStyles.dropdownItem,
                      commonStyles.dropdownItemDanger
                    )}
                    onClick={() => setShowDeleteConfirmationModal(true)}
                  >
                    <Trash2 size="1rem" />
                    <span>Delete</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </h2>
          </Col>
        </Row>
      </div>

      <CampaignForm campaign={campaign} />

      <CampaignConfirmDeleteModal
        organization={organization}
        campaign={campaign}
        show={showDeleteConfirmationModal}
        onHide={() => setShowDeleteConfirmationModal(false)}
      />
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

CampaignEditPage.getLayout = manageNonprofitLayout;

export default CampaignEditPage;
