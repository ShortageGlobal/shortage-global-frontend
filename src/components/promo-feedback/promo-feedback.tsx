import styles from './promo-feedback.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { SectionHeader } from 'components/section-header/section-header';

const FEEDBACK = [
  {
    name: 'Clare P.',
    img: '/images/promo-feedback/feedback_clare.png',
    message:
      'Yesterday I used Shortage to donate items to a homeless shelter in my hometown and a school located in another state. I love knowing that the things I sent are truly needed, and I can’t wait for my video receipt!',
  },
  {
    name: 'Stephan from Oregon',
    img: '/images/promo-feedback/feedback_stephan.png',
    message:
      'The website is excellent. Everyone should be very proud of how Shortage is helping people.',
  },
  {
    name: 'Lisa N.',
    img: '/images/promo-feedback/feedback_lisa.png',
    message:
      'I feel a sense of connection with the people I support and that Shortage gives an opportunity to help in a manner that feels more personal to me. Shortage’s mission is one that I am proud to support.',
  },
];

export function PromoFeedback() {
  return (
    <Container>
      <Row>
        <Col>
          <SectionHeader>Why do donors choose Shortage?</SectionHeader>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className={styles.promoFeedback}>
            {FEEDBACK.map((feedback) => {
              return (
                <div key={feedback.name} className={styles.feedback}>
                  <div className={styles.imgContainer}>
                    <Image
                      className={styles.leftWing}
                      src="/images/promo-feedback/left_angel_wing.svg"
                      alt=""
                      width="57"
                      height="60"
                    />
                    <Image
                      className={styles.photo}
                      src={feedback.img}
                      alt=""
                      width="100"
                      height="100"
                    />
                    <Image
                      className={styles.rightWing}
                      src="/images/promo-feedback/right_angel_wing.svg"
                      alt=""
                      width="57"
                      height="60"
                    />
                  </div>
                  <p className={styles.name}>{feedback.name}</p>
                  <p className={styles.message}>
                    &laquo;{feedback.message}&raquo;
                  </p>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
