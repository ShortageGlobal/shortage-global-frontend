import styles from './promo-banner.module.scss';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronsDown } from 'react-feather';
import { REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';

export function PromoBanner() {
  return (
    <div className={styles.promoBannerWrap}>
      <Container className={styles.promoBanner}>
        <Row>
          <Col>
            <div className={styles.banner}>
              <h2 className={styles.header}>
                Donate{' '}
                <span className={styles.highlightedHeader}>tangible goods</span>
              </h2>

              <p className={styles.text}>
                A place for you to donate{' '}
                <span className="text-uppercase">goods</span> directly to the
                charities that need it most
              </p>

              <Link
                href={`#${REQUESTED_GOODS_CONTAINER_ID}`}
                passHref
                legacyBehavior
              >
                <Button size="lg" className={styles.checkGoodsButton}>
                  <span>Check Out Our Top Requests</span>
                  <ChevronsDown />
                </Button>
              </Link>

              <div className={classNames(styles.image, styles.glisterLeft)}>
                <Image
                  alt=""
                  src="/images/promo-banner/glister-left.svg"
                  fill
                />
              </div>
              <div className={classNames(styles.image, styles.glisterRight)}>
                <Image
                  alt=""
                  src="/images/promo-banner/glister-right.svg"
                  fill
                />
              </div>

              <div
                className={classNames(styles.image, styles.glisterLeftShort)}
              >
                <Image
                  alt=""
                  src="/images/promo-banner/glister_left_short.svg"
                  fill
                />
              </div>
              <div
                className={classNames(styles.image, styles.glisterRightShort)}
              >
                <Image
                  alt=""
                  src="/images/promo-banner/glister_right_short.svg"
                  fill
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
