import styles from 'styles/pages/package-status.module.scss';
import { useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import { wrapper } from 'app/store';
import { useAppSelector } from 'app/hooks';
import {
  fetchOrganization,
  selectOrganization,
} from 'app/store/slices/organization';
import { fetchPackage, selectPackage } from 'app/store/slices/package';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getPackageStatusCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PACKAGE_STATUS_LABEL } from 'app/constants';
import type { NextPageWithLayout } from 'pages/_app';

const PackageRegistrationPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectOrganization);
  const packageState = useAppSelector(selectPackage);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getPackageStatusCrumb({
        organizationSlug: organization.slug,
        packageId: packageState.package.uuid,
        isActive: true,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>Package is registered | ShortageGlobal</title>
      </Head>

      <Container className={styles.packageStatus}>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>

        <Row>
          <Col className={styles.packageStatus}>
            <h2 className="text-break">Package is registered</h2>
          </Col>
        </Row>

        <Row>
          <Col>
            {/* {state?.justRegistered ? (
              <div>The confirmation email will be in your inbox shortly.</div>
            ) : null} */}
            <p>Thank you for helping 💚</p>

            <header className={styles.sectionHeader}>
              <h5>Package Details</h5>
            </header>

            <dl className={styles.packageDetails}>
              <dt>Shipping Carrier</dt>
              <dd>{packageState.package.delivery_company}</dd>
              <dt>Tracking number</dt>
              <dd>{packageState.package.tracking_code}</dd>
            </dl>

            <header className={styles.sectionHeader}>
              <h5>Package Status</h5>
            </header>

            <p>{PACKAGE_STATUS_LABEL[packageState.package.status]}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;
    const packageId = context.params.packageId as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug })),
      store.dispatch(fetchPackage({ organizationSlug, packageId })),
    ]);

    const { organization, package: packageState } = store.getState();

    if (
      organization.error?.status === 404 ||
      packageState.error?.status === 404
    ) {
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
