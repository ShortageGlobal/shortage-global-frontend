import styles from 'styles/pages/private/donations/donations.module.scss';
import { useState, useMemo, useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import Head from 'next/head';
import { accountLayout } from 'core/layouts';
import { AccountBreadcrumbsContainer } from 'core/layouts/account-layout/account-breadcrumbs-container';
import { wrapper } from 'core/store';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { fetchAccountPackage } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getAccountDonationsCrumb,
  getAccountDonationDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { LoadingMessage } from 'components/loading-message/loading-message';
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

  const { showNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [donation, setDonation] = useState<Package>(null);

  const getFetchDataCancelToken = useCancelToken();

  // fetch donations
  useEffect(() => {
    setIsLoading(true);
    (async function fetchData() {
      const cancelToken = getFetchDataCancelToken();
      try {
        const response = await fetchAccountPackage({
          packageId,
          cancelToken,
        });
        setIsLoading(false);
        setDonation(response.data);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsLoading(false);
        let errorMessage = `Failed to load donation.`;
        if (rejection?.response?.data?.details) {
          errorMessage = `${errorMessage} ${rejection?.response?.data?.details}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
      }
    })();
  }, [packageId]);

  return (
    <>
      <Head>
        <title>Account Donation Details | Shortage</title>
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
            {!donation && isLoading ? <LoadingMessage /> : null}

            {donation && !isLoading ? (
              <div>
                <Badge bg="warning">
                  <span className="text-uppercase">To be done soon</span>
                </Badge>
              </div>
            ) : null}
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
