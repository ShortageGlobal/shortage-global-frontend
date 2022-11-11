import styles from 'styles/pages/private/donations/donations.module.scss';
import { useMemo } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import Head from 'next/head';
import { accountLayout } from 'core/layouts';
import { AccountBreadcrumbsContainer } from 'core/layouts/account-layout/account-breadcrumbs-container';
import { wrapper } from 'core/store';
// import { fetchAccountPackage } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getAccountDonationsCrumb,
  getAccountDonationDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';
import type { Package } from 'core/api/types';

type DonationDetailsPageProps = {
  packageId: Package['uuid'];
};

const DonationDetailsPage: NextPageWithLayout = ({
  packageId,
}: DonationDetailsPageProps) => {
  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getAccountDonationsCrumb(),
      getAccountDonationDetailsCrumb({ packageId, isActive: true }),
    ];
  }, []);

  return (
    <>
      <Head>
        <title>Donation Details | Shortage</title>
      </Head>

      <AccountBreadcrumbsContainer>
        <Breadcrumbs items={breadcrumbs} />
      </AccountBreadcrumbsContainer>

      <div className={styles.donations}>
        <Row>
          <Col>
            <h2 className={styles.header}>
              <span>Donation Details</span>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <Badge bg="warning">
                <span className="text-uppercase">To be done soon</span>
              </Badge>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

DonationDetailsPage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const packageId = context.params.packageId as string;

    return {
      props: { packageId },
    };
  }
);

export default DonationDetailsPage;
