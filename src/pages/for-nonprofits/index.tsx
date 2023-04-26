import styles from 'styles/pages/for-nonprofits.module.scss';
import { useMemo, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { wrapper } from 'core/store';
import { fetchPromotedOrganizations } from 'core/store/slices/promoted-organizations';
import { fetchPromotedExternalOrganizations } from 'core/store/slices/promoted-external-organizations';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForNonprofitsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { NonprofitRegistrationForm } from 'components/nonprofit-registration-form/nonprofit-registration-form';
import { PromotedOrganizations } from 'components/promoted-organizations/promoted-organizations';
import {
  NONPROFIT_REGISTRATION_FORM_ID,
  NONPROFIT_REGISTRATION_EMAIL_INPUT_ID,
} from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import Link from 'next/link';

const ForNonprofits: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getForNonprofitsCrumb({ isActive: true })];
  }, []);

  const handleBookDemo = useCallback(() => {
    document.getElementById(NONPROFIT_REGISTRATION_FORM_ID)?.scrollIntoView();
    document
      .getElementById(NONPROFIT_REGISTRATION_EMAIL_INPUT_ID)
      ?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <Head>
        <title>
          Join Shortage and save time on managing in-kind donation campaigns
        </title>

        <meta
          property="og:title"
          key="og:title"
          content="Join Shortage and save time on managing in-kind donation campaigns"
        />
        <meta
          property="description"
          key="description"
          content="As a nonprofit organization on Shortage, you can easily connect with donors and receive in-kind donations through our peer-to-peer marketplace. We provide a platform for individuals and businesses to browse and purchase items that your organization needs, or donate items they already have. Our platform also offers features such as automated tax receipts for donations and the ability to upload photos and videos of the delivery and use of donated items. Join Shortage and start making a positive impact in your community today."
        />
        <meta
          property="og:description"
          key="og:description"
          content="As a nonprofit organization on Shortage, you can easily connect with donors and receive in-kind donations through our peer-to-peer marketplace. We provide a platform for individuals and businesses to browse and purchase items that your organization needs, or donate items they already have. Our platform also offers features such as automated tax receipts for donations and the ability to upload photos and videos of the delivery and use of donated items. Join Shortage and start making a positive impact in your community today."
        />
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
                <span className={styles.highlighted}>in-kind</span>
                <br />
                donations
              </h2>

              <p className={styles.bannerText}>
                Create your own page with Shortage and start receiving goods
              </p>

              <div className={styles.bookDemoWrap}>
                <Link href="/for-nonprofits/join/" passHref legacyBehavior>
                  <Button size="lg" className={styles.bookDemo}>
                    Join Shortage
                  </Button>
                </Link>
              </div>

              <div className={classNames(styles.image, styles.womanLeft)}>
                <Image
                  alt=""
                  src="/images/characters/woman-with-packages-looks-right.svg"
                  fill
                />
              </div>
              <div className={classNames(styles.image, styles.manRight)}>
                <Image
                  alt=""
                  src="/images/characters/man-with-packages-looks-left.svg"
                  fill
                />
              </div>
            </div>
          </Col>
        </Row>

        <div className={styles.section}>
          <Row>
            <Col md={5}>
              <div className={styles.textWrap}>
                <div
                  className={classNames(
                    styles.sectionHeader,
                    styles.highlightedHeader
                  )}
                >
                  Save your time
                </div>
                <div className={styles.sectionText}>
                  Please fill out the form, and we&apos;ll get back to you right
                  away
                </div>
              </div>
            </Col>
            <Col md={7}>
              <div className={styles.formWrap}>
                <NonprofitRegistrationForm />
              </div>
            </Col>
          </Row>
        </div>

        <h2 className={classNames(styles.benefitsHeader, 'text-center')}>
          The Benefits
        </h2>

        <div className={classNames(styles.section, styles.sectionGrey)}>
          <Row>
            <div className={classNames(styles.sectionHeader, 'text-center')}>
              Your own unique page
            </div>
            <Col md={7}>
              <div className={styles.textWrap}>
                <div className={styles.sectionText}>
                  <div>
                    As a registered non-profit organization, you are eligible to
                    receive a personal web page with a wishlist of needed items
                    and a delivery address.
                  </div>

                  <div>
                    You can also add a &ldquo;Donate via Shortage&rdquo; button
                    to your website and share the link on social media,
                    newsletters, and emails to reach potential donors.
                  </div>
                </div>
              </div>
            </Col>
            <Col md={5} className={styles.illustrationCol}>
              <Image
                className={styles.illustration}
                src="/images/for-nonprofits/frame_heart_palms.svg"
                alt=""
                width="212"
                height="198"
              />
            </Col>
          </Row>
        </div>

        <div className={styles.section}>
          <Row>
            <div className={classNames(styles.sectionHeader, 'text-center')}>
              Manage donations
            </div>
            <Col
              md={{ span: 5, order: 1 }}
              xxs={{ order: 3 }}
              className={styles.illustrationCol}
            >
              <Image
                className={styles.illustration}
                src="/images/for-nonprofits/manage_donations.svg"
                alt=""
                width="327"
                height="181"
              />
            </Col>
            <Col md={{ span: 7, order: 2 }}>
              <div className={styles.textWrap}>
                <div className={styles.sectionText}>
                  <div>
                    Our platform allows you to gather and save donor data for
                    future campaigns, as opposed to Amazon gift lists which do
                    not provide this information.
                  </div>
                  <div>
                    Our technology automatically generates tax deduction
                    receipts/emails and sends them to donors to make the
                    donation process more convenient and efficient.
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className={classNames(styles.section, styles.sectionGrey)}>
          <Row>
            <div className={classNames(styles.sectionHeader, 'text-center')}>
              Going viral on social media
            </div>
            <Col md={7}>
              <div className={styles.textWrap}>
                <div className={styles.sectionText}>
                  <div>
                    We enable and encourage donors to share their impact on
                    social media.
                  </div>

                  <div>
                    By using our platform, you can not only streamline the
                    donation process, but also tap into the power of social
                    media to engage new donors.
                  </div>
                </div>
              </div>
            </Col>
            <Col md={5} className={styles.illustrationCol}>
              <Image
                className={styles.illustration}
                src="/images/for-nonprofits/sharing_social.svg"
                alt=""
                width="250"
                height="250"
              />
            </Col>
          </Row>
        </div>

        <div className={styles.section}>
          <Row>
            <div className={classNames(styles.sectionHeader, 'text-center')}>
              Our impact
            </div>
            <Col
              md={{ span: 5, order: 1 }}
              xxs={{ order: 3 }}
              className={styles.illustrationCol}
            >
              <Image
                className={styles.illustration}
                src="/images/for-nonprofits/delivered_packages.svg"
                alt=""
                width={250}
                height={250}
              />
            </Col>
            <Col md={{ span: 7, order: 2 }}>
              <div className={styles.textWrap}>
                <div className={styles.sectionText}>
                  <div>
                    In a 6 month span, our team has already delivered more than{' '}
                    <span className={styles.highlighted}>30,000 items</span> to
                    trusted nonprofits.
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className={classNames(styles.section, styles.sectionGrey)}>
          <Row>
            <div className={classNames(styles.sectionHeader, 'text-center')}>
              Subscription plans <strong>for nonprofits</strong>
            </div>

            <div className={classNames(styles.sectionSubHeader, 'text-center')}>
              In order to grow and develop the platform, we charge a
              subscription fee. All new partners receive{' '}
              <span className={styles.subHeaderHighlight}>
                a free 3 month trial period!
              </span>
            </div>
          </Row>

          <Row>
            <Col
              lg={{ span: 4, order: 1 }}
              xxs={{ order: 4 }}
              className={styles.illustrationCol}
            >
              <Image
                className={styles.illustration}
                src="/images/for-nonprofits/subscriptions_pot.svg"
                alt=""
                width={220}
                height={220}
              />

              <Button
                size="lg"
                className={classNames(styles.bookDemo, 'mt-4')}
                onClick={handleBookDemo}
              >
                Book a demo
              </Button>
            </Col>

            <Col lg={{ span: 4, order: 2 }} md={{ span: 6, order: 2 }}>
              <div className={styles.subscriptionPlan}>
                <div className={styles.subscriptionTitle}>Basic</div>

                <div className={styles.subscriptionCostWrap}>
                  <div className={styles.price}>$12</div>
                  <div className={styles.priceMonthly}>monthly</div>
                  <div className={styles.priceAnnualy}>
                    or <b>$100</b> per year
                  </div>
                </div>

                <ul className={styles.subscriptionFeatures}>
                  <li>Personal account</li>
                  <li>24/7 moderator support</li>
                  <li>
                    Donor communication is managed on our end (with LiveChat)
                  </li>
                  <li>Access to all statistics</li>
                </ul>
              </div>
            </Col>

            <Col lg={{ span: 4, order: 3 }} md={{ span: 6, order: 3 }}>
              <div className={styles.subscriptionPlan}>
                <div className={styles.subscriptionTitle}>Standard</div>

                <div className={styles.subscriptionCostWrap}>
                  <div className={styles.price}>$25</div>
                  <div className={styles.priceMonthly}>monthly</div>
                  <div className={styles.priceAnnualy}>
                    or <b>$210</b> per year
                  </div>
                </div>

                <ul className={styles.subscriptionFeatures}>
                  <li>Everything from the &quot;Basic&quot; package</li>
                  <li>Publishing a press release</li>
                  <li>Writing a digest and emailing to Shortage partners</li>
                  <li>Create content for your social media </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        <div className={classNames(styles.section, styles.partnersSection)}>
          <Row>
            <div className={classNames(styles.sectionHeader, 'text-center')}>
              Meet some of our partners
            </div>
            <Col>
              <PromotedOrganizations />
            </Col>
          </Row>
        </div>

        <div className={styles.bookDemoWrap}>
          <Link href="/for-nonprofits/join/" passHref legacyBehavior>
            <Button size="lg" className={styles.bookDemo}>
              Join Shortage
            </Button>
          </Link>

          <strong>or</strong>

          <Button
            size="lg"
            className={styles.bookDemo}
            variant="outline-primary"
            onClick={handleBookDemo}
          >
            Book a demo
          </Button>
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    // fetch partners
    await Promise.all([
      store.dispatch(fetchPromotedOrganizations()),
      store.dispatch(fetchPromotedExternalOrganizations()),
    ]);

    return {
      props: {},
    };
  }
);

export default ForNonprofits;
