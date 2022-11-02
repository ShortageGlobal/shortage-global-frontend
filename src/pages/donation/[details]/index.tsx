import styles from 'styles/pages/donation-details.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Loader } from 'react-feather';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCart } from 'core/hooks';
import { wrapper } from 'core/store';
import { fetchCorporateDonationOptions } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { DonationDetailsForm } from 'components/donation-details-form/donation-details-form';
import type { NextPageWithLayout } from 'pages/_app';
import type { CountryChoice } from 'core/api/types';

type DonationDetailsProps = {
  countries: CountryChoice[];
};

const DonationDetails: NextPageWithLayout = ({
  countries,
}: DonationDetailsProps) => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getDonationDetailsCrumb({ isActive: true })];
  }, []);

  const router = useRouter();
  const { cart, isCartReady } = useCart();

  const [showDonationDetailsAlert, setShowDonationDetailsAlert] = useState(
    () => !!router.query.showDonationDetailsAlert
  );

  const handleDismissDonationDetailsAlert = useCallback(() => {
    setShowDonationDetailsAlert(false);

    // remove "showDonationDetailsAlert" from query params
    const queryParams = { ...router.query };
    delete queryParams.showDonationDetailsAlert;

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router]);

  return (
    <>
      <Head>
        <title>Donation Details | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      {/* TODO: placeholder for "isCartReady" */}

      {/* Donation Details Form */}
      <Container>
        <Row>
          <Col className={styles.donationDetails}>
            {showDonationDetailsAlert ? (
              <Alert
                variant="info"
                className={styles.requireDetailsAlert}
                onClose={handleDismissDonationDetailsAlert}
                dismissible
              >
                <Alert.Heading>Details required</Alert.Heading>
                <div>Fill in the form below before proceeding.</div>
              </Alert>
            ) : null}

            {!isCartReady ? (
              <div className={styles.loadingMessage}>
                <Loader
                  role="status"
                  aria-hidden="true"
                  className={animationStyles.rotate}
                />
                <span>Loading cart...</span>
              </div>
            ) : null}

            {isCartReady ? (
              <DonationDetailsForm cart={cart} countries={countries} />
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  // fetch countries choices
  const response = await fetchCorporateDonationOptions();
  const countries = response.data.actions.POST.country.choices;
  return {
    props: { countries },
  };
});

export default DonationDetails;
