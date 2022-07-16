import styles from './footer.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';

export function Footer() {
  const copyrightText = (
    <span>
      &copy; {new Date().getFullYear()} All rights reserved. ShortageGlobal
    </span>
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
                  src="/logo/ShortageGlobal-black.png"
                  alt="ShortageGlobal"
                  layout="fill"
                  priority
                />
              </a>
            </Link>

            <div className={styles['copyright-block']}>{copyrightText}</div>
          </Col>

          <Col md="6" className={styles['contact-mail']}>
            <a href="mailto:info@shortage.global">info@shortage.global</a>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
