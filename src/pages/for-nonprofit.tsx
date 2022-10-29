import styles from 'styles/pages/for-nonprofit.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { wrapper } from 'app/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForNonprofitCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { NonprofitRegistrationForm } from 'components/nonprofit-registration-form/nonprofit-registration-form';
import type { NextPageWithLayout } from 'pages/_app';

const ForNonprofit: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getForNonprofitCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>For Nonprofit | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.forNonprofit}>
        <Row>
          <Col>
            <div className={styles.banner}>
              <h2 className={styles.header}>
                Increase your{' '}
                <span className={styles.highlightedHeader}>
                  tangible <br />
                  goods
                </span>{' '}
                donations
              </h2>

              <div className={styles.bannerText}>
                <p>
                  <span className={styles.textOnWhite}>
                    We will create your unique page (
                    <Link href="/organizations/meira_academy">
                      {/* TODO: Hardcoded href! */}
                      <a>check an example here</a>
                    </Link>
                    ) with a list of requested goods and guarantee delivery of
                    donated goods directly from your donors to your
                    office/warehouse.
                  </span>
                </p>
                <p className={styles.pleaseCompleteFormMessage}>
                  Please complete the form below and we&apos;ll get back to you
                  right away.
                </p>
              </div>

              <div className={classNames(styles.image, styles.womanLeft)}>
                <Image
                  alt=""
                  src="/images/characters/woman-with-packages-looks-right.svg"
                  layout="fill"
                />
              </div>
              <div className={classNames(styles.image, styles.manRight)}>
                <Image
                  alt=""
                  src="/images/characters/man-with-packages-looks-left.svg"
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
            <NonprofitRegistrationForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ForNonprofit;
