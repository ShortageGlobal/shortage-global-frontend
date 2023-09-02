import styles from './we-are-here-for-you.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export function WeAreHereForYou() {
  return (
    <Container className={styles.weAreHereForYou}>
      <Row className="justify-content-center">
        <Col className={styles.content}>
          <h2 className={styles.header}>We are here for you</h2>
          <p>
            If you have any questions or would like more information, please
            reach out to our wonderful{' '}
            <a href="mailto:support@shortage.global">support team</a> who will
            be happy to help you.
          </p>
        </Col>

        <Col xs="auto">
          <div className={styles.imageContainer}>
            <Image
              alt=""
              src="/images/characters/woman-sits-looks-left.svg"
              fill
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
