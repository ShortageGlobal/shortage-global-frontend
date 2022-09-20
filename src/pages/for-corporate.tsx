import styles from 'styles/pages/for-corporate.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { wrapper } from 'app/store';
import { fetchCorporateDonationOptions } from 'app/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForCorporateCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CorporateDonationRegistrationForm } from 'components/corporate-donation-registration-form/corporate-donation-registration-form';
import type { NextPageWithLayout } from 'pages/_app';
import type { CountryChoice } from 'app/api/types';

type ForCorporateProps = {
  countries: CountryChoice[];
};

const ForCorporate: NextPageWithLayout = ({ countries }: ForCorporateProps) => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getForCorporateCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>For Corporate | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.forCorporate}>
        <Row>
          <Col>
            <div className={styles.banner}>
              <h2 className={styles.header}>
                Donate{' '}
                <span className={styles.highlightedHeader}>
                  tangible goods <br /> to help
                </span>{' '}
                others
              </h2>

              <p className={styles.bannerText}>
                Ready to donate? Please complete as much of the form below as
                you can and we'll get back to you right away. Eventually, all of
                the information will be needed for the smooth delivery of your
                donation, but{' '}
                <span className={styles.textHighlighted}>
                  submit as much as you can
                </span>{' '}
                now and we will get started.
              </p>

              <div className={classNames(styles.image, styles.girlJumpsRight)}>
                <Image
                  src="/images/characters/girl-jumps-right.svg"
                  layout="fill"
                />
              </div>
              <div className={classNames(styles.image, styles.boyJumpsLeft)}>
                <Image
                  src="/images/characters/boy-jumps-left.svg"
                  layout="fill"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col className={styles.donorRegistration}>
            <CorporateDonationRegistrationForm countries={countries} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  // fetch organizations and categories
  const response = await fetchCorporateDonationOptions();
  const countries = response.data.actions.POST.country.choices;
  return {
    props: { countries },
  };
});

export default ForCorporate;
