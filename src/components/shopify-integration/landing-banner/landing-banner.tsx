import styles from './landing-banner.module.scss';
import Image from 'next/image';
import { ArrowRight } from 'react-feather';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { StoreIllustration } from 'components/shopify-integration/store-illustration/store-illustration';
import { SHOPIFY_APP_URL } from 'core/constants';

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
          <div className={styles.installButtonWrap}>
            <Button
              size="lg"
              className={styles.installButton}
              href={SHOPIFY_APP_URL}
              disabled
            >
              <span>Install Shortage App</span>
              <ArrowRight size={20} className={styles.arrow} />
            </Button>
            <em className="text-muted">*Coming soon</em>
          </div>
        </Col>

        <Col lg={7}>
          <StoreIllustration />
        </Col>
      </Row>
    </Container>
  );
}
