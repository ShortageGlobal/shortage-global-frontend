import styles from 'styles/pages/shopify-integration.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import {
  Breadcrumbs,
  getHomeCrumb,
  getShopifyIntegrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { SectionHeader } from 'components/section-header/section-header';
import { LandingBanner } from 'components/shopify-integration/landing-banner/landing-banner';
import { PromoSocialMedia } from 'components/promo-social-media/promo-social-media';
import { SHOPIFY_APP_URL } from 'core/constants';
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

        <Row>
          <Col>
            <SectionHeader className={styles.sectionHeader}>
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
