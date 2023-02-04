import { useMemo } from 'react';
import Head from 'next/head';
import { manageNonprofitLayout } from 'core/layouts';
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
  getManageNonprofitDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import type { NextPageWithLayout } from 'pages/_app';

const NonprofitDetailsPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    if (!organization) {
      return [];
    }
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageNonprofitDetailsCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  if (!organization) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${organization.name} Details | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div>TBD {organization.name} details</div>
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

NonprofitDetailsPage.getLayout = manageNonprofitLayout;

export default NonprofitDetailsPage;
