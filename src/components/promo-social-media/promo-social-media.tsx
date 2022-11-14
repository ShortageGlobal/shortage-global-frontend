import styles from './promo-social-media.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { SectionHeader } from 'components/section-header/section-header';

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
              >
                <Image
                  src="/images/social-media-glyphs/linkedin.svg"
                  alt="Shortage LinkedIn page"
                  fill
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/shortage.global/"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/images/social-media-glyphs/facebook.svg"
                  alt="Shortage Facebook page"
                  fill
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/shortage.global/"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/images/social-media-glyphs/instagram.svg"
                  alt="Shortage Instagram page"
                  fill
                />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/shortageglobal"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/images/social-media-glyphs/twitter.svg"
                  alt="Shortage Twitter page"
                  fill
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.reddit.com/user/ShortageGlobal/"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/images/social-media-glyphs/reddit.svg"
                  alt="Shortage Reddit page"
                  fill
                />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
