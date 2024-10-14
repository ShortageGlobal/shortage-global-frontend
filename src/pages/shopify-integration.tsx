import styles from 'styles/pages/shopify-integration.module.scss';
import { useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ArrowRight } from 'react-feather';
import classNames from 'classnames';
import {
  Breadcrumbs,
  getHomeCrumb,
  getShopifyIntegrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { SectionHeader } from 'components/section-header/section-header';
import { LandingBanner } from 'components/shopify-integration/landing-banner/landing-banner';
import { DemoRequestForm } from 'components/demo-request-form/demo-request-form';
import { PromoSocialMedia } from 'components/promo-social-media/promo-social-media';
import { SHOPIFY_APP_URL, DEMO_REQUEST_SOURCE } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';

const ShopifyIntegration: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getShopifyIntegrationCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>
          Install Shortage app to boost your Shopify store with meaningful
          upsells
        </title>

        <meta
          property="og:title"
          key="og:title"
          content="Install Shortage app to boost your Shopify store with meaningful upsells"
        />
        <meta
          property="description"
          key="description"
          content="With Shortage app, your customers can easily make direct donations by ordering extra items, enhancing their shopping experience and contributing to meaningful causes."
        />
        <meta
          property="og:description"
          key="og:description"
          content="With Shortage app, your customers can easily make direct donations by ordering extra items, enhancing their shopping experience and contributing to meaningful causes."
        />
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <LandingBanner />
          </Col>
        </Row>

        <Row className={styles.demoRequestRow}>
          <Col md={5}>
            <div className={styles.heading}>Save your time</div>
            <div
              className={classNames(
                styles.sectionText,
                'text-center',
                'text-md-start'
              )}
            >
              Fill out the form, and we&apos;ll get back to you right away
            </div>
          </Col>
          <Col md={7}>
            <div className={styles.formWrap}>
              <DemoRequestForm
                source={DEMO_REQUEST_SOURCE.SHOPIFY_INTEGRATION}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <SectionHeader className={classNames(styles.sectionHeader, 'mt-5')}>
              Boost Your Shopify Store with Meaningful Upsells Using Shortage
              App
            </SectionHeader>
          </Col>
        </Row>

        <Row className="justify-content-md-center mx-3">
          <Col xl={8}>
            <p className={classNames('fs-5', styles.textBullets)}>
              Empower your customers to support the causes they care about in
              just minutes with Shortage App. Our app seamlessly aggregates
              in-kind donation requests from US nonprofits and matches them with
              products in your store.
            </p>
            <p className={classNames('fs-5', styles.textBullets)}>
              With Shortage App, your customers can easily make direct donations
              by ordering extra items, enhancing their shopping experience and
              contributing to meaningful causes. By connecting your inventory
              with real-time needs of US-based charities, you support nonprofits
              while fostering a community of giving that creates lasting
              connections with your customers.
            </p>
            <p className={classNames('fs-5', styles.textBullets)}>
              Differentiate your brand and grow your business by providing an
              effortless way for your customers to do good. Join the movement
              and make every purchase count.
            </p>
            <p className={classNames('fs-5')}>
              Get started with <a href={SHOPIFY_APP_URL}>Shortage App</a> today!
            </p>
          </Col>
        </Row>

        <Row className="justify-content-md-center mx-3">
          <Col xl={7} lg={10}>
            <ul className={styles.benefitsList}>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Set up quickly and effortlessly with full Shopify integration—no
                coding required
              </li>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Access a comprehensive list of nonprofit requests for goods
              </li>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Choose charities that align with your mission and sales strategy
              </li>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Facilitate meaningful upsells through additional orders
              </li>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Save time and resources with automated tax receipts and donation
                processing
              </li>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Showcase your impact on social media with authentic photos
              </li>
              <li className={classNames('fs-5', styles.benefitItem)}>
                <Image
                  aria-hidden="true"
                  className={styles.checkmark}
                  src="/images/shopify-integration/green_check.svg"
                  alt="Checkmark icon"
                  width={24}
                  height={24}
                />
                Receive transparent and detailed reports directly in your
                Shopify admin
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col>
            <SectionHeader className={styles.sectionHeader}>
              Pricing
            </SectionHeader>
            {/* <p className="fs-5 text-center">All charges are billed in USD</p> */}
          </Col>
        </Row>

        <Row className="justify-content-md-center mb-5">
          <Col lg={4} md={6}>
            <div className={styles.pricingPlan}>
              {/* <div className={styles.pricingOptionTitle}>Basic</div> */}

              <div>
                <div className={styles.freePrice}>Free</div>
              </div>

              <ul className={styles.pricingFeatures}>
                <li>Set donatable items in your Shopify admin</li>
                <li>Available on Product & Cart Pages</li>
                <li>All nonprofit communication on our end</li>
                <li>
                  Automatically send customized donation email including tax
                  dedication receipt
                </li>
              </ul>
            </div>
          </Col>

          {/* <Col lg={4} md={6}>
            <div className={styles.pricingPlan}>
              <div className={styles.pricingOptionTitle}>Advanced</div>

              <div className={styles.pricingCostWrap}>
                <div className={styles.price}>$9</div>
                <div className={styles.priceMonthly}>monthly</div>
                <div className={styles.priceAnnualy}>
                  or <b>$99</b> per year
                </div>
              </div>

              <ul className={styles.pricingFeatures}>
                <li>All basic plan features</li>
                <li>
                  Impact calculator - track and share your impact with real
                  photos
                </li>
                <li>24/7 moderator support</li>
              </ul>
            </div>
          </Col> */}
        </Row>

        <Row>
          <Col>
            <div className={styles.installButtonWrap}>
              <Button
                size="lg"
                className={styles.installButton}
                href={SHOPIFY_APP_URL}
              >
                <span>Install Shortage App</span>
                <ArrowRight size={20} className={styles.arrow} />
              </Button>
            </div>
          </Col>
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

export default ShopifyIntegration;
