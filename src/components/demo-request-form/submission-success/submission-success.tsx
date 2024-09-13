import styles from './submission-success.module.scss';
import { useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

type SubmissionSuccessProps = {
  onDismiss: () => void;
};

export function SubmissionSuccess({ onDismiss }: SubmissionSuccessProps) {
  const topHeader = useRef<HTMLHeadingElement>();

  useEffect(() => {
    topHeader.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <Container className={styles.submissionSuccess}>
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
