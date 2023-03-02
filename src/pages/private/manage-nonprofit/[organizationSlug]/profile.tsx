import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import { manageNonprofitLayout } from 'core/layouts';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchAccountOrganization,
  selectAccountOrganization,
} from 'core/store/slices/account-organization';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageNonprofitProfileCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ProfileForm } from 'components/profile-form/profile-form';
import type { NextPageWithLayout } from 'pages/_app';

const ProfilePage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageNonprofitProfileCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, []);

  return (
    <>
      <Head>
        <title>Profile | Shortage</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>Profile</h2>
        </Col>
      </Row>

      <ProfileForm />
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

ProfilePage.getLayout = manageNonprofitLayout;

export default ProfilePage;
