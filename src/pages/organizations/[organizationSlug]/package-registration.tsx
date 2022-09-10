import { useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import { wrapper } from 'app/store';
import { useAppSelector } from 'app/hooks';
import {
  fetchOrganization,
  selectOrganization,
} from 'app/store/slices/organization';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getPackageRegistrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const PackageRegistrationPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getPackageRegistrationCrumb({
        organizationSlug: organization.slug,
        isActive: true,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>Register package for {organization.name} | ShortageGlobal</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug })),
    ]);

    const { organization } = store.getState();

    if (organization.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default PackageRegistrationPage;
