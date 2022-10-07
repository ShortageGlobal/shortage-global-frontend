import styles from 'styles/pages/about-us.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumbs,
  getHomeCrumb,
  getAboutUsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { REQUESTED_GOODS_CONTAINER_ID } from 'app/constants';
import type { NextPageWithLayout } from 'pages/_app';

const team = [
  {
    name: 'Kseniia Khrystova, CEO',
    url: 'https://www.linkedin.com/in/kseniia-khrystova-774840b0/',
    image: '/images/team/Kseniia_Khrystova.jpg',
  },
  {
    name: 'Serhii Holinei, CTO',
    url: 'https://www.linkedin.com/in/serhii-holinei/',
    image: '/images/team/Serhii_Holinei.jpg',
  },
  {
    name: 'Alina Fedorenko, COO',
    url: 'https://www.linkedin.com/in/alina-volokh/',
    image: '/images/team/Alina_Fedorenko.jpg',
  },
];

const AboutUs: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getAboutUsCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>About Us | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.howItWorks}>
        <Row>
          <Col>
            <div className={styles.banner}>
              <h2 className={styles.header}>
                Donate{' '}
                <span className={styles.highlightedHeader}>tangible goods</span>
                <br />
                and feel{' '}
                <span className={styles.highlightedHeader}>
                  the joy of giving
                </span>
              </h2>

              <div
                className={classNames(styles.image, styles.imageBoyLooksRight)}
              >
                <Image
                  alt=""
                  src="/images/characters/boy-looks-right.svg"
                  layout="fill"
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageGirlRunsRight)}
              >
                <Image
                  alt=""
                  src="/images/characters/girl-runs-right.svg"
                  layout="fill"
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageGirlLooksLeft)}
              >
                <Image
                  alt=""
                  src="/images/characters/girl-looks-left.svg"
                  layout="fill"
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageBoyRunsLeft)}
              >
                <Image
                  alt=""
                  src="/images/characters/boy-runs-left.svg"
                  layout="fill"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className={styles.aboutPlatform}>
        <Row>
          <Col>
            <p>
              Shortage is a place where you can easily donate{' '}
              <b>requested goods</b> to the nonprofits you trust.
            </p>

            <p>
              Our team believes that the <b>“in-kind”</b> donation of goods
              gives donors a better understanding of real needs and provides
              more agency and control over donations. In addition, it allows
              donors to build a stronger connection with the nonprofits they
              support.
            </p>

            <p>
              Our platform provides you a receipt for a tax deduction and a
              photo/video from the nonprofit that you can share on social media.
            </p>

            <p className={styles.accentedText}>
              Over <span className={styles.highlighted}>25,000 items</span>{' '}
              delivered to charities in the past 6 months
            </p>
          </Col>
        </Row>

        <h4>Ready to donate?</h4>

        <Row>
          <Col className="text-center">
            <Link href={`/#${REQUESTED_GOODS_CONTAINER_ID}`} passHref>
              <Button size="lg" className={styles.checkGoodsButton}>
                <span>Check Out Our Top Requests</span>
              </Button>
            </Link>
          </Col>
        </Row>

        <Row>
          <Col>
            <h2 className={styles.header}>We are here for you to help</h2>
          </Col>
        </Row>

        <Row>
          <Col>
            <p>
              The Shortage team works 24/7 to make your donation experience
              simple and pleasant.
            </p>
          </Col>
        </Row>

        <Row md={3} sm={2} xs={1}>
          {team.map((member) => {
            return (
              <Col key={member.name}>
                <a
                  className={styles.teamCard}
                  href={member.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img alt="" className={styles.memberImg} src={member.image} />
                  <div className={styles.memberBody}>
                    <div className={styles.memberName}>{member.name}</div>
                    <Image
                      src="/images/team/LinkedIn_Logo.svg"
                      width={24}
                      height={24}
                      alt="LinkedIn logo"
                    />
                  </div>
                </a>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default AboutUs;
