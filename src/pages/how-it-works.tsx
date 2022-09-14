import styles from 'styles/pages/how-it-works.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import {
  Breadcrumbs,
  getHomeCrumb,
  getHowItWorksCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const HowItWorks: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getHowItWorksCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>How it works | ShortageGlobal</title>
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
              <h2 className={styles.header}>How it works</h2>
              <p className={styles.motto}>
                Donate tangible goods and feel <br />
                the joy of giving
              </p>

              <div className={styles.description}>
                <div>
                  <h4 className={styles.descriptionHeader}>
                    <span className={styles.number}>1</span>
                    <span>Find what is needed</span>
                  </h4>
                  <ul className={styles.descriptionList}>
                    <li>Chose an item</li>
                    <li>
                      Order the item(s) online <br />
                      or send what you own using instructions
                    </li>
                    <li>Register your donation</li>
                  </ul>
                </div>
                <div>
                  <h4 className={styles.descriptionHeader}>
                    <span className={styles.number}>2</span>
                    <span>Manage donations</span>
                  </h4>
                  <ul className={styles.descriptionList}>
                    <li>
                      Register your donor account to keep in touch with us
                    </li>
                    <li>
                      Check the photo/video report of the delivery <br />
                      in your personal account or via a unique link we provide
                    </li>
                    <li>Share your impact on social media </li>
                  </ul>
                </div>
              </div>

              <div
                className={classNames(styles.image, styles.imageBoyLooksRight)}
              >
                <Image
                  src="/images/characters/boy-looks-right.svg"
                  layout="fill"
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageGirlRunsRight)}
              >
                <Image
                  src="/images/characters/girl-runs-right.svg"
                  layout="fill"
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageGirlLooksLeft)}
              >
                <Image
                  src="/images/characters/girl-looks-left.svg"
                  layout="fill"
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageBoyRunsLeft)}
              >
                <Image
                  src="/images/characters/boy-runs-left.svg"
                  layout="fill"
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className={styles.aboutPlatform}>
            <p>
              Our platform provides an alternative way to give. Here you can
              easily donate tangible goods instead of money to nonprofits you
              trust.
            </p>
            <p>
              Goods donation gives you as a donor more control, you can receive
              proof of your donation in a photo or video report.
            </p>
            <p>
              The Shorage team believes in this approach and plans to make it a
              new giving trend. Join us!
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HowItWorks;
