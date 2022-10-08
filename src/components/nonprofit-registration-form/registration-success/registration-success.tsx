import styles from './registration-success.module.scss';
import { useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

type NonprofitRegistrationSuccessProps = {
  onDismiss: () => void;
};

export function NonprofitRegistrationSuccess({
  onDismiss,
}: NonprofitRegistrationSuccessProps) {
  const topHeader = useRef<HTMLHeadingElement>();

  useEffect(() => {
    topHeader.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <Container className={styles.registrationSuccess}>
      <Row>
        <Col>
          <h2 className={styles.header} ref={topHeader}>
            Done!
          </h2>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>Thank you for submitting the form 💚</p>

          <p>We received your information and will reach out to you shortly.</p>

          <Button
            variant="outline-dark"
            onClick={onDismiss}
            className={styles.dismissBtn}
          >
            Got it
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
