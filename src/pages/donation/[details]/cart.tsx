import styles from 'styles/pages/donation-cart.module.scss';
import { useMemo, useCallback, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const { isCartReady, isDonationDetailsFilled } = useCart();

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getDonationDetailsCrumb(),
      getDonationCartCrumb({ isActive: true }),
    ];
  }, []);

  useEffect(() => {
    if (isCartReady) {
      if (!isDonationDetailsFilled) {
        router.push({
          pathname: '/donation/details',
          query: {
            showDonationDetailsAlert: true,
          },
        });
      } else {
      }
    }
  }, [isCartReady, isDonationDetailsFilled]);

  const handleFundDonation = useCallback(() => {
    //
  }, []);

  const handleTangibleDonation = useCallback(() => {
    //
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

      <Container>
        <Row>
          <Col className={styles.donationCart}>
            {isCartReady && isDonationDetailsFilled ? (
              <div>
                <button onClick={handleFundDonation}>Fund Donation</button>
              </div>
            ) : null}

            {isCartReady && !isDonationDetailsFilled ? (
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
                <span>
                  Redirecting to{' '}
                  <Link href={{ pathname: '/donation/details' }}>
                    <a>Donation Details</a>
                  </Link>
                </span>
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
