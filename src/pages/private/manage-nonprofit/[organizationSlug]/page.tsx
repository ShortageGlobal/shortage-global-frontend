import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo, useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { Eye, Edit, Settings, Trash2 } from 'react-feather';
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
  getManageNonprofitPageCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { NonprofitPageForm } from 'components/manage-nonprofit/page/nonprofit-page-form/nonprofit-page-form';
import { NonprofitConfirmUnpublishModal } from 'components/manage-nonprofit/page/nonprofit-confirm-unpublish-modal/nonprofit-confirm-unpublish-modal';
import { NonprofitConfirmDeleteModal } from 'components/manage-nonprofit/page/nonprofit-confirm-delete-modal/nonprofit-confirm-delete-modal';
import type { NextPageWithLayout } from 'pages/_app';

const NonprofitPagePage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const [showBackToDraftModal, setShowBackToDraftModal] = useState(false);
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
      getManageNonprofitPageCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Nonprofit Page | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>
              <span>Nonprofit Page</span>

              <Dropdown>
                <Dropdown.Toggle variant="outline">
                  <Settings />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Link
                    href={{
                      pathname: '/[organizationSlug]/',
                      query: {
                        organizationSlug: organization.slug,
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

                  {!organization.is_draft ? (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        as="button"
                        className={classNames(commonStyles.dropdownItem)}
                        onClick={() => setShowBackToDraftModal(true)}
                      >
                        <Edit size="1rem" />
                        <span>Back to draft</span>
                      </Dropdown.Item>
                    </>
                  ) : null}

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
                    <span>Delete page</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <NonprofitConfirmUnpublishModal
                organization={organization}
                show={showBackToDraftModal}
                onHide={() => setShowBackToDraftModal(false)}
              />

              <NonprofitConfirmDeleteModal
                organization={organization}
                show={showDeleteConfirmationModal}
                onHide={() => setShowDeleteConfirmationModal(false)}
              />
            </h2>
          </Col>
        </Row>
      </div>

      <NonprofitPageForm />
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

NonprofitPagePage.getLayout = manageNonprofitLayout;

export default NonprofitPagePage;
