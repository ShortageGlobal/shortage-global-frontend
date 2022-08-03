import styles from './landing-banner.module.scss';
import donationStepsStyles from './donation-steps.module.scss';
import { Container, Row, Col } from 'react-bootstrap';

export function LandingBanner() {
  return (
    <Container className={styles.landingBanner}>
      <Row>
        <Col className={styles.backgroundContainer}>
          <div className={styles.bannerHeader}>
            <span>Donate tangible goods</span>
          </div>
          <div className={styles.bannerText}>
            <p>
              A place for you to donate{' '}
              <span className="text-uppercase">goods</span> directly to charity
              and receive a photo report of delivery where it is needed
            </p>
          </div>

          <ol className={donationStepsStyles.donationSteps}>
            <li>
              <div
                className={donationStepsStyles.stepWrap}
                role="button"
                onClick={() => {
                  document
                    .getElementById('needed-supplies-header')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className={donationStepsStyles.stepText}>
                  Find supplies
                </div>
              </div>
            </li>
            <li>
              <div className={donationStepsStyles.stepWrap}>
                <div className={donationStepsStyles.stepText}>
                  Package & send
                </div>
              </div>
            </li>
            <li>
              <div className={donationStepsStyles.stepWrap}>
                <div className={donationStepsStyles.stepText}>
                  Enter tracking info
                </div>
              </div>
            </li>
          </ol>
        </Col>
      </Row>
    </Container>
  );
}
