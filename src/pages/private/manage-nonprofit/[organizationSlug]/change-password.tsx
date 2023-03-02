import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Head from 'next/head';
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
  getManageNonprofitChangePasswordCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ChangePasswordForm } from 'components/change-password-form/change-password-form';
import type { NextPageWithLayout } from 'pages/_app';

const ManageNonprofitChangePasswordPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageNonprofitChangePasswordCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, []);

  return (
    <>
      <Head>
        <title>Change Password | Shortage</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>Change Password</h2>
        </Col>
      </Row>

      <Row>
        <Col>
          <ChangePasswordForm />
        </Col>
      </Row>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;

    await Promise.all([
      store.dispatch(
        fetchAccountOrganization({ organizationSlug, accessToken })
      ),
    ]);

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

ManageNonprofitChangePasswordPage.getLayout = manageNonprofitLayout;

export default ManageNonprofitChangePasswordPage;
