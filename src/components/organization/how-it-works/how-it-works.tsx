import styles from './how-it-works.module.scss';
import donationStepsStyles from 'components/donation-steps/donation-steps.module.scss';
import classNames from 'classnames';
import {
  Col,
  Container,
  Row,
  Accordion,
  useAccordionButton,
} from 'react-bootstrap';
import { REQUESTED_GOODS_CONTAINER_ID } from 'app/constants';

const ACCORDION_KEY = 'ACCORDION_KEY';

export function OrganizationHowItWorks() {
  return (
    <Container>
      <Row>
        <Col>
          <Accordion as={Container} className={styles.howItWorks}>
            <Row>
              <Col
                lg="6"
                className={classNames(styles.centerLgCol, 'text-center')}
              >
                <h2 className={styles.header}>How it works</h2>
              </Col>
              <Col
                lg="6"
                className={classNames(
                  styles.centerLgCol,
                  styles.detailsControlCol
                )}
              >
                <DetailsToggle />
              </Col>
            </Row>

            <ol
              className={classNames(
                donationStepsStyles.donationSteps,
                donationStepsStyles.donationStepsDark,
                styles.donationSteps
              )}
            >
              <li>
                <div
                  className={donationStepsStyles.stepWrap}
                  role="button"
                  onClick={() => {
                    document
                      .getElementById(REQUESTED_GOODS_CONTAINER_ID)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className={donationStepsStyles.stepBlock}>
                    <span className={donationStepsStyles.stepText}>
                      Find supplies
                    </span>
                  </div>
                </div>

                <Accordion.Collapse eventKey={ACCORDION_KEY}>
                  <p className={styles.donationStepDetails}>
                    Select an item below and click <b>CHECK DETAILS</b>. Find an
                    online or physical store to purchase the item
                  </p>
                </Accordion.Collapse>
              </li>
              <li>
                <div className={donationStepsStyles.stepWrap}>
                  <div className={donationStepsStyles.stepBlock}>
                    <span className={donationStepsStyles.stepText}>
                      Package & send
                    </span>
                  </div>
                </div>

                <Accordion.Collapse eventKey={ACCORDION_KEY}>
                  <p className={styles.donationStepDetails}>
                    Order, package, and mail the item following the delivery
                    instructions. Click <b>CHECK DELIVERY INSTRUCTIONS</b>
                  </p>
                </Accordion.Collapse>
              </li>
              <li>
                <div className={donationStepsStyles.stepWrap}>
                  <div className={donationStepsStyles.stepBlock}>
                    <span className={donationStepsStyles.stepText}>
                      Enter tracking info
                    </span>
                  </div>
                </div>

                <Accordion.Collapse eventKey={ACCORDION_KEY}>
                  <p className={styles.donationStepDetails}>
                    Register your package with Shortage (
                    <b>CHECK DELIVERY INSTRUCTIONS &rarr; REGISTER PACKAGE</b>
                    ). Shortage keeps track of the supplies delivered with its
                    help. Once the need is fulfilled, new items can be featured
                  </p>
                </Accordion.Collapse>
              </li>
            </ol>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

function DetailsToggle() {
  const handleToggle = useAccordionButton(ACCORDION_KEY);

  return (
    <span
      className={classNames('dropdown-toggle', styles.dropdownToggle)}
      role="button"
      onClick={handleToggle}
    >
      Details
    </span>
  );
}
