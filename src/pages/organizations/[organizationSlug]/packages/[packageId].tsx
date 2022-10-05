import styles from 'styles/pages/package-status.module.scss';
import { useMemo, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Row, Col, Alert } from 'react-bootstrap';
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
  const router = useRouter();

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

  const [showDonationSuccessAlert, setShowDonationSuccessAlert] = useState(
    () => router.query?.paymentStatus === 'succeeded'
  );

  const handleDismissDonationSuccessAlert = useCallback(() => {
    setShowDonationSuccessAlert(false);

    // remove "paymentStatus" from query params
    const queryParams = { ...router.query };
    delete queryParams.paymentStatus;

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router]);

  return (
    <>
      <Head>
        <title>Package is registered | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col className={styles.packageStatus}>
            {showDonationSuccessAlert ? (
              <Row>
                <Col>
                  <Alert
                    variant="success"
                    className={styles.requireDetailsAlert}
                    onClose={handleDismissDonationSuccessAlert}
                    dismissible
                  >
                    <Alert.Heading>Thank you for your donation</Alert.Heading>
                    <div>
                      The payment is being processed. You can track the status
                      of your donation on this page. The confirmation email will
                      be in your inbox shortly.
                    </div>
                  </Alert>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col>
                <h2>Package is registered</h2>
              </Col>
            </Row>

            <Row>
              <Col>
                <p>Thank you for helping 💚</p>

                {packageState.package.delivery_company &&
                packageState.package.tracking_code ? (
                  <>
                    <header className={styles.sectionHeader}>
                      <h5>Package Details</h5>
                    </header>

                    <dl className={styles.packageDetails}>
                      <dt>Shipping Carrier</dt>
                      <dd>{packageState.package.delivery_company}</dd>
                      <dt>Tracking number</dt>
                      <dd>{packageState.package.tracking_code}</dd>
                    </dl>
                  </>
                ) : null}

                <header className={styles.sectionHeader}>
                  <h5>Package Status</h5>
                </header>

                <p>{PACKAGE_STATUS_LABEL[packageState.package.status]}</p>
              </Col>
            </Row>
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
