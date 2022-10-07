import styles from './footer.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';

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
            <Link href="/">
              <a className={styles.logo}>
                <Image
                  src="/images/logo/Shortage.svg"
                  alt="Shortage"
                  layout="fill"
                  priority
                />
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
            <a href="mailto:support@shortage.global">support@shortage.global</a>

            <Link href="/privacy-policy">Privacy Policy</Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
