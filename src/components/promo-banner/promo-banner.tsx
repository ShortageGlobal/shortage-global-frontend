import styles from './promo-banner.module.scss';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import Link from 'next/link';
import { ChevronsDown } from 'react-feather';
import { REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';
import {
  GlisterLeft,
  GlisterLeftShort,
  GlisterRight,
  GlisterRightShort,
} from 'components/icons';

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
                  <span>Check out our top requests</span>
                  <ChevronsDown />
                </Button>
              </Link>

              <div className={classNames(styles.image, styles.glisterLeft)}>
                <GlisterLeft />
              </div>
              <div className={classNames(styles.image, styles.glisterRight)}>
                <GlisterRight />
              </div>

              <div
                className={classNames(styles.image, styles.glisterLeftShort)}
              >
                <GlisterLeftShort />
              </div>
              <div
                className={classNames(styles.image, styles.glisterRightShort)}
              >
                <GlisterRightShort />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
