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

const HowItWorks: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getHowItWorksCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>How it works | Shortage</title>
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
      </Container>

      <Container className={styles.aboutPlatform}>
        <Row>
          <Col>
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

        <Row>
          <Col>
            <h2 className={styles.header}>We are here for you to help</h2>
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
                  <img
                    className={styles.memberImg}
                    src={member.image}
                    alt={member.name}
                  />
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

export default HowItWorks;
