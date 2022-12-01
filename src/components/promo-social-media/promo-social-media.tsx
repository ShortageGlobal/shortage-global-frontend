import styles from './promo-social-media.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { SectionHeader } from 'components/section-header/section-header';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Reddit,
  Twitter,
} from 'components/icons';

export function PromoSocialMedia() {
  return (
    <Container>
      <Row>
        <Col>
          <SectionHeader>Join us on social media</SectionHeader>
        </Col>
      </Row>

      <Row>
        <Col>
          <ul className={styles.promoSocialMedia}>
            <li>
              <a
                href="https://www.linkedin.com/company/shortageglobal/"
                target="_blank"
                rel="noreferrer"
                aria-label="Shortage LinkedIn page"
              >
                <LinkedIn size="2rem" />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/shortage.global/"
                target="_blank"
                rel="noreferrer"
                aria-label="Shortage Facebook page"
              >
                <Facebook size="2rem" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/shortage.global/"
                target="_blank"
                rel="noreferrer"
                aria-label="Shortage Instagram page"
              >
                <Instagram size="2rem" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/shortageglobal"
                target="_blank"
                rel="noreferrer"
                aria-label="Shortage Twitter page"
              >
                <Twitter size="2rem" />
              </a>
            </li>
            <li>
              <a
                href="https://www.reddit.com/user/ShortageGlobal/"
                target="_blank"
                rel="noreferrer"
                aria-label="Shortage Reddit page"
              >
                <Reddit size="2rem" />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
