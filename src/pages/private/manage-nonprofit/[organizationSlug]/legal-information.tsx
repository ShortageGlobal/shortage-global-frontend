import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import { manageNonprofitLayout } from 'core/layouts';
import { wrapper } from 'core/store';
import { fetchCorporateDonationOptions } from 'core/api';
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
  getManageNonprofitLegalInformationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { LegalInformationForm } from 'components/manage-nonprofit/legal-information/legal-information-form';
import type { NextPageWithLayout } from 'pages/_app';
import type { CountryChoice } from 'core/api/types';

type NonprofitLegalInformationPageProps = {
  countries: CountryChoice[];
};

const NonprofitLegalInformationPage: NextPageWithLayout = ({
  countries,
}: NonprofitLegalInformationPageProps) => {
  const { organization } = useAppSelector(selectAccountOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageNonprofitLegalInformationCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Legal Information | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>Legal Information</h2>
        </Col>
      </Row>

      <LegalInformationForm countries={countries} />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;

    const [countriesResponse] = await Promise.all([
      fetchCorporateDonationOptions(),
      store.dispatch(
        fetchAccountOrganization({ organizationSlug, accessToken })
      ),
    ]);
    const countries = countriesResponse.data.actions.POST.country.choices;

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
      props: { countries },
    };
  }
);

NonprofitLegalInformationPage.getLayout = manageNonprofitLayout;

export default NonprofitLegalInformationPage;
