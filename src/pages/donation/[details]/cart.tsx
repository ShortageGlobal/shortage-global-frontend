import styles from 'styles/pages/donation-cart.module.scss';
import { useMemo, useCallback } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Head from 'next/head';
import { useCart } from 'app/hooks';
import { wrapper } from 'app/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getDonationCartCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import type { NextPageWithLayout } from 'pages/_app';

const DonationCart: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getDonationDetailsCrumb(),
      getDonationCartCrumb({ isActive: true }),
    ];
  }, []);

  const { isCartReady } = useCart();

  const handleFundDonation = useCallback(() => {
    alert('Shalom!');
  }, []);

  return (
    <>
      <Head>
        <title>Donation Cart | Shortage</title>
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
          <Col className={styles.donationCart}>
            {isCartReady ? (
              <div>
                <button onClick={handleFundDonation}>Fund Donation</button>
              </div>
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
  return {
    props: {},
  };
});

export default DonationCart;
