import styles from './footer.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';

export function Footer() {
  const copyrightText = (
    <span>&copy; {new Date().getFullYear()} All rights reserved. Shortage</span>
  );
  return (
    <Container
      as="footer"
      fluid
      className={classNames(styles.footer, 'mt-auto')}
    >
      <Container>
        <Row>
          <Col md="6">
            <Link href="/">
              <a className={styles.logo}>
                <Image
                  src="/images/logo/ShortageGlobal-black.png"
                  alt="Shortage"
                  layout="fill"
                  priority
                />
              </a>
            </Link>

            <div className={styles.copyrightBlock}>{copyrightText}</div>
          </Col>

          <Col md="6" className={styles.contactMail}>
            <a href="mailto:notifications@shortage.global">
              notifications@shortage.global
            </a>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
