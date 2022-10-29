import styles from './footer.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';
import { LogoImage } from 'components/logo-image/logo-image';

export function Footer() {
  return (
    <Container
      as="footer"
      fluid
      className={classNames(styles.footer, 'mt-auto')}
    >
      <Container>
        <Row>
          <Col md="6" className={styles.leftColumn}>
            <Link href="/" className={styles.logo}>
              <a>
                <LogoImage />
              </a>
            </Link>

            <div className={styles.address}>
              440 N Barranca Ave #7074 Covina, CA 91723
            </div>

            <div className={styles.copyrightBlock}>
              &copy; {new Date().getFullYear()} All rights reserved. Shortage
            </div>
          </Col>

          <Col md="6" className={styles.rightColumn}>
            <ul className={styles.socialMediaLinks}>
              <li>
                <a
                  href="https://twitter.com/shortageglobal"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/social-media-glyphs/twitter.svg"
                    alt="Shortage Twitter page"
                    layout="fill"
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
                    layout="fill"
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
                    layout="fill"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/shortageglobal/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/social-media-glyphs/linkedin.svg"
                    alt="Shortage LinkedIn page"
                    layout="fill"
                  />
                </a>
              </li>
            </ul>

            <a href="mailto:support@shortage.global">support@shortage.global</a>

            <Link href="/privacy-policy">Privacy Policy</Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
