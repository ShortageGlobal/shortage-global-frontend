import styles from './promo-banner.module.scss';
import donationStepsStyles from 'components/donation-steps/donation-steps.module.scss';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { NEEDED_SUPPLIES_CONTAINER_ID } from 'app/constants';

export function PromoBanner() {
  return (
    <Container className={styles.promoBanner}>
      <Row>
        <Col>
          <div className={styles.backgroundContainer}>
            <div className={styles.bannerHeader}>
              <span>Donate tangible goods</span>
            </div>
            <div className={styles.bannerText}>
              <p>
                A place for you to donate{' '}
                <span className="text-uppercase">goods</span> directly to
                charity and receive a photo report of delivery where it is
                needed
              </p>

              <p className={styles.taxDeductableBadgeContainer}>
                <Badge
                  className={styles.taxDeductableBadge}
                  bg="warning"
                  text="dark"
                >
                  All donations are tax deductible
                </Badge>
              </p>
            </div>

            <ol className={donationStepsStyles.donationSteps}>
              <li>
                <div
                  className={donationStepsStyles.stepWrap}
                  role="button"
                  onClick={() => {
                    document
                      .getElementById(NEEDED_SUPPLIES_CONTAINER_ID)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className={donationStepsStyles.stepBlock}>
                    <span className={donationStepsStyles.stepText}>
                      Find supplies
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className={donationStepsStyles.stepWrap}>
                  <div className={donationStepsStyles.stepBlock}>
                    <span className={donationStepsStyles.stepText}>
                      Package & send
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className={donationStepsStyles.stepWrap}>
                  <div className={donationStepsStyles.stepBlock}>
                    <span className={donationStepsStyles.stepText}>
                      Enter tracking info
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
