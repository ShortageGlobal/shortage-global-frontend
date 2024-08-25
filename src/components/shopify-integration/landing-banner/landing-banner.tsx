import styles from './landing-banner.module.scss';
import Image from 'next/image';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { StoreIllustration } from 'components/shopify-integration/store-illustration/store-illustration';

export function LandingBanner() {
  return (
    <Container className={styles.landingBanner}>
      <Row>
        <Col lg={5}>
          {/* Shopify */}
          <Image
            alt="Shopify"
            src="/images/shopify-integration/shopify.svg"
            width={92}
            height={26}
          />

          {/* Shortage icon and title */}
          <div className={styles.appLogoTitle}>
            <div className={styles.appLogo}>
              <Image
                alt="Shortage App"
                src="/images/shopify-integration/shortage-logo.svg"
                width={50}
                height={50}
              />
            </div>

            <h2 className={styles.appTitle}>
              Shortage&nbsp;App — Shopify&nbsp;Donations
            </h2>
          </div>

          {/* Moto */}
          <div className={styles.moto}>
            Donate&nbsp;Goods&nbsp;Effortlessly. Free&nbsp;Installation.
          </div>

          {/* Install Button */}
          <Button
            size="lg"
            className={styles.installButton}
            href="https://shopify.com"
          >
            <span>Install Shortage App</span>
          </Button>
        </Col>

        <Col lg={7}>
          <StoreIllustration />
        </Col>
      </Row>
    </Container>
  );
}
