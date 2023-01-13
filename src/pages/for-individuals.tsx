import styles from 'styles/pages/for-individuals.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForIndividualsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import {
  Convenience,
  DirectImpact,
  Efficiency,
  TaxBenefits,
  Transparency,
} from 'components/icons';
import { SectionHeader } from 'components/section-header/section-header';
import { PromoSocialMedia } from 'components/promo-social-media/promo-social-media';
import { REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';
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

const ForIndividuals: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getForIndividualsCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>
          Join Shortage and start making a positive impact in your community
          today
        </title>

        <meta
          property="og:title"
          key="og:title"
          content="Join Shortage and start making a positive impact in your community today"
        />
        <meta
          property="description"
          key="description"
          content="On Shortage, individuals can purchase needed items through the platform or donate items they already have to trusted charities. The platform also provides features such as automated tax receipts for donations and encourages donors to share their impact on social media."
        />
        <meta
          property="og:description"
          key="og:description"
          content="On Shortage, individuals can purchase needed items through the platform or donate items they already have to trusted charities. The platform also provides features such as automated tax receipts for donations and encourages donors to share their impact on social media."
        />
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.forIndividualsBanner}>
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

              <p className={styles.bannerText}>
                Over 25,000 items delivered to charities in the past 6 months
              </p>

              <Link
                href={`/#${REQUESTED_GOODS_CONTAINER_ID}`}
                passHref
                legacyBehavior
              >
                <Button size="lg" className={styles.checkGoodsButton}>
                  <span>Check out our top requests</span>
                </Button>
              </Link>

              <div
                className={classNames(styles.image, styles.imageBoyLooksRight)}
              >
                <Image
                  alt=""
                  src="/images/characters/boy-looks-right.svg"
                  fill
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageGirlRunsRight)}
              >
                <Image
                  alt=""
                  src="/images/characters/girl-runs-right.svg"
                  fill
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageGirlLooksLeft)}
              >
                <Image
                  alt=""
                  src="/images/characters/girl-looks-left.svg"
                  fill
                />
              </div>
              <div
                className={classNames(styles.image, styles.imageBoyRunsLeft)}
              >
                <Image alt="" src="/images/characters/boy-runs-left.svg" fill />
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
          </Col>
        </Row>

        <Row>
          <Col>
            <SectionHeader className={styles.sectionHeader}>
              Our Principles
            </SectionHeader>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className={styles.ourPrinciples}>
              <div
                className={classNames(
                  styles.transparencyPrinciple,
                  styles.principleContainer
                )}
              >
                <Transparency size={70} />
                <div className={styles.principleHeader}>Transparency</div>
                <div className={styles.principleText}>
                  The platform allows donors to track the progress of their
                  donations and see when they are delivered to the nonprofit.
                  This can help to increase trust and confidence in the donation
                  process.
                </div>
              </div>

              <div
                className={classNames(
                  styles.directImpactPrinciple,
                  styles.principleContainer
                )}
              >
                <DirectImpact size={70} />
                <div className={styles.principleHeader}>Direct Impact</div>
                <div className={styles.principleText}>
                  By using the platform, donors can directly impact the
                  nonprofit organizations and communities that they care about,
                  and see the impact of their donations first-hand.
                </div>
              </div>

              <div
                className={classNames(
                  styles.efficiencyPrinciple,
                  styles.principleContainer
                )}
              >
                <Efficiency size={70} />
                <div className={styles.principleHeader}>Efficiency</div>
                <div className={styles.principleText}>
                  The platform streamlines the donation process, making it
                  easier for nonprofit organizations to receive and manage
                  donations, which can help them to focus on their core missions
                  and goals.
                </div>
              </div>

              <div
                className={classNames(
                  styles.conveniencePrinciple,
                  styles.principleContainer
                )}
              >
                <Convenience size={70} />
                <div className={styles.principleHeader}>Convenience</div>
                <div className={styles.principleText}>
                  The Shortage platform allows donors to easily browse and
                  select items that they would like to donate, as well as choose
                  the nonprofit organization that they would like to support.
                </div>
              </div>

              <div
                className={classNames(
                  styles.taxBenefitsPrinciple,
                  styles.principleContainer
                )}
              >
                <TaxBenefits size={70} />
                <div className={styles.principleHeader}>Tax Benefits</div>
                <div className={styles.principleText}>
                  The platform generates tax-deductible receipts for donors,
                  which can help them to save money on their taxes.
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <SectionHeader className={styles.sectionHeader}>
              Our Team
            </SectionHeader>
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

        <Row md={3} xs={2} xxs={1} className={styles.membersContainer}>
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

        <Row>
          <Col>
            <PromoSocialMedia />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ForIndividuals;
