import styles from './promo-banner.module.scss';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { REQUESTED_GOODS_CONTAINER_ID } from 'app/constants';
import { ChevronsDown } from 'react-feather';

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

              <Link href={`#${REQUESTED_GOODS_CONTAINER_ID}`} passHref>
                <Button size="lg" className={styles.checkGoodsButton}>
                  <span>Check Out Our Top Requests</span>
                  <ChevronsDown />
                </Button>
              </Link>

              <div className={classNames(styles.image, styles.glisterLeft)}>
                <Image
                  alt=""
                  src="/images/promo-banner/glister-left.svg"
                  layout="fill"
                />
              </div>
              <div className={classNames(styles.image, styles.glisterRight)}>
                <Image
                  alt=""
                  src="/images/promo-banner/glister-right.svg"
                  layout="fill"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
