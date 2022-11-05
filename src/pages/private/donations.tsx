import styles from 'styles/pages/private/profile.module.scss';
import { useMemo, useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import Head from 'next/head';
import { accountLayout } from 'core/layouts';
import { AccountBreadcrumbsContainer } from 'core/layouts/account-layout/account-breadcrumbs-container';
import { wrapper } from 'core/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const DonationsPage: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getDonationsCrumb({ isActive: true })];
  }, []);

  // fetch donations
  useEffect(() => {
    //
  }, []);

  return (
    <>
      <Head>
        <title>Donations | Shortage</title>
      </Head>

      <AccountBreadcrumbsContainer>
        <Breadcrumbs items={breadcrumbs} />
      </AccountBreadcrumbsContainer>

      <div className={styles.profile}>
        <Row>
          <Col>
            <h2 className={styles.header}>
              <span>Donations</span>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Badge bg="warning" className={styles.badge}>
              TO BE DONE SOON
            </Badge>
          </Col>
        </Row>
      </div>
    </>
  );
};

DonationsPage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default DonationsPage;
