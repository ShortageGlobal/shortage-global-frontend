import styles from './we-are-here-for-you.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export function WeAreHereForYou() {
  return (
    <Container className={styles.weAreHereForYou}>
      <Row className="justify-content-md-center">
        <Col>
          <div className={styles.content}>
            <h2>We are here for you</h2>
            <p>
              If you have any questions or would like more information, please
              reach out to our wonderful support team who will be happy to help
              you.
            </p>
          </div>
        </Col>
        <Col sm="auto">
          <Image
            src="/images/characters/woman-sits-looks-left.svg"
            width="326"
            height="243"
          />
        </Col>
      </Row>
    </Container>
  );
}
