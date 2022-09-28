import styles from 'styles/pages/donation-details.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Head from 'next/head';
import { useCart } from 'app/hooks';
import { wrapper } from 'app/store';
import { fetchCorporateDonationOptions } from 'app/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { DonationDetailsForm } from 'components/donation-details-form/donation-details-form';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import type { NextPageWithLayout } from 'pages/_app';
import type { CountryChoice } from 'app/api/types';

type DonationDetailsProps = {
  countries: CountryChoice[];
};

const DonationDetails: NextPageWithLayout = ({
  countries,
}: DonationDetailsProps) => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getDonationDetailsCrumb({ isActive: true })];
  }, []);

  const { cart, isCartReady } = useCart();

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
            {isCartReady ? (
              <DonationDetailsForm cart={cart} countries={countries} />
            ) : null}

            {!isCartReady ? (
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
                <span>Loading cart...</span>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>

      <WeAreHereForYou />
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
