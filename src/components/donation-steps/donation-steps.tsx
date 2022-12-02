import styles from './donation-steps.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import {
  ChooseItems,
  GetTaxDeduction,
  PurchaseSend,
  ShareYourImpact,
} from 'components/icons';

export function DonationSteps() {
  return (
    <Container className={styles.donationStepsContainer}>
      <Row>
        <Col>
          <ol className={styles.donationSteps}>
            <li className={styles.donationStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>1</div>
                <ChooseItems size="5rem" />
              </div>
              <div className={styles.title}>Select Item(s)</div>
              <div className={styles.text}>
                Our platform lists requested goods
              </div>
            </li>

            <li className={styles.donationStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>2</div>
                <PurchaseSend size="4.5rem" />
              </div>
              <div className={styles.title}>Purchase & Send</div>
              <div className={styles.text}>
                Order directly from our marketplace or send what you already
                have
              </div>
            </li>

            <li className={styles.donationStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>3</div>
                <GetTaxDeduction size="5rem" />
              </div>
              <div className={styles.title}>Get a Tax Deduction</div>
              <div className={styles.text}>
                A tax deduction receipt will be emailed to your inbox
              </div>
            </li>

            <li className={styles.donationStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>4</div>
                <ShareYourImpact size="5rem" />
              </div>
              <div className={styles.title}>Share Your Impact</div>
              <div className={styles.text}>
                We will send you a photo when the items are delivered
              </div>
            </li>
          </ol>
        </Col>
      </Row>
    </Container>
  );
}
