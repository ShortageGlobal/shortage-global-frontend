import styles from './promo-steps.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export function PromoSteps() {
  return (
    <Container className={styles.promoStepsContainer}>
      <Row>
        <Col>
          <ol className={styles.promoSteps}>
            <li className={styles.promoStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>1</div>
                <div className={styles.glyph}>
                  <Image
                    alt=""
                    src="/images/donation-steps/choose-items.svg"
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.title}>Choose Item(s)</div>
              <div className={styles.text}>
                Our platform lists requested goods
              </div>
            </li>

            <li className={styles.promoStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>2</div>
                <div className={styles.glyph}>
                  <Image
                    alt=""
                    src="/images/donation-steps/purchase-send.svg"
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.title}>Purchase & Send</div>
              <div className={styles.text}>
                Order online or send what you have
              </div>
            </li>

            <li className={styles.promoStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>3</div>
                <div className={styles.glyph}>
                  <Image
                    alt=""
                    src="/images/donation-steps/get-tax-deduction.svg"
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.title}>Get tax deduction</div>
              <div className={styles.text}>
                Required receipt will be sent to your email
              </div>
            </li>

            <li className={styles.promoStep}>
              <div className={styles.graphics}>
                <div className={styles.number}>4</div>
                <div className={styles.glyph}>
                  <Image
                    alt=""
                    src="/images/donation-steps/share-your-impact.svg"
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.title}>Share your impact</div>
              <div className={styles.text}>
                A nonprofit will provide you a photo of delivered goods
              </div>
            </li>
          </ol>
        </Col>
      </Row>
    </Container>
  );
}
