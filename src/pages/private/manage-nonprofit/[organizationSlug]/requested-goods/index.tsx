import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
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
  getManageRequestedGoodsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ProductsList } from 'components/manage-nonprofit/products/products-list';
import type { NextPageWithLayout } from 'pages/_app';
import { Plus } from 'react-feather';

const RequestedGoodsPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageRequestedGoodsCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Requested Goods | Shortage`}</title>
      </Head>
      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>
      <Row>
        <Col>
          <h2 className={commonStyles.header}>Requested Goods</h2>
        </Col>
        <Col>
          <Button size="lg">
            <Plus />
            <span>Add</span>
          </Button>
        </Col>
      </Row>

      <ProductsList />
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

RequestedGoodsPage.getLayout = manageNonprofitLayout;

export default RequestedGoodsPage;
