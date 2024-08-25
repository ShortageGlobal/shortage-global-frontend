import styles from 'styles/pages/shopify-integration.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumbs,
  getHomeCrumb,
  getShopifyIntegrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { SectionHeader } from 'components/section-header/section-header';
import { LandingBanner } from 'components/shopify-integration/landing-banner/landing-banner';
import { PromoSocialMedia } from 'components/promo-social-media/promo-social-media';
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
      </Container>

      <Container>
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
