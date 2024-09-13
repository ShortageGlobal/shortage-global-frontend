import styles from './demo-request-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { demoRequest } from 'core/api';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { SubmissionSuccess } from 'components/demo-request-form/submission-success/submission-success';
import {
  DEMO_REQUEST_FORM_ID,
  DEMO_REQUEST_EMAIL_INPUT_ID,
  DEMO_REQUEST_SOURCE,
} from 'core/constants';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  email: DEMO_REQUEST_EMAIL_INPUT_ID,
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.email]: 'email',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function DemoRequestForm({ source }: { source: DEMO_REQUEST_SOURCE }) {
  const { showNotification } = useNotifications();

  const [isPending, setIsPending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [email, setEmail] = useState('');

  const getRegistrationCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isPending) {
        return;
      }

      const cancelToken = getRegistrationCancelToken();

      setIsPending(true);
      try {
        await demoRequest({ email, source, cancelToken });

        gtm.trackDemoRequest();

        setIsPending(false);
        setIsRegistered(true);
        setErrors(null);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);
        setIsRegistered(false);
        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejection?.response?.data);
        } else {
          setErrors(null);
          showNotification({
            isFailure: true,
            message: 'Failed to submit information',
          });
        }
      }
    },
    [isPending, email, showNotification]
  );

  const handleFormReset = useCallback(() => {
    setIsPending(false);
    setIsRegistered(false);
    setErrors(null);

    setEmail('');
  }, []);

  const getIsValid = (key: ErrorKey) =>
    !(errors?.[key]?.length > 0) && errors !== null;
  const getIsInvalid = (key: ErrorKey) => errors?.[key]?.length > 0;

  const getErrorsFeedback = (key: ErrorKey) =>
    errors?.[key]?.map((errorMessage) => {
      return (
        <Form.Control.Feedback key={errorMessage} type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      );
    });

  if (isRegistered) {
    return <SubmissionSuccess onDismiss={handleFormReset} />;
  }

  return (
    <Form
      id={DEMO_REQUEST_FORM_ID}
      onSubmit={handleFormSubmit}
      className={styles.demoRequestForm}
    >
      <Row>
        <Form.Group
          as={Col}
          xs={8}
          controlId={INPUT_ID.email}
          className={styles.formGroup}
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            size="lg"
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={getIsValid(ERROR_KEYS[INPUT_ID.email])}
            isInvalid={getIsInvalid(ERROR_KEYS[INPUT_ID.email])}
          />
          {getErrorsFeedback(ERROR_KEYS[INPUT_ID.email])}
        </Form.Group>

        <Col xs={4}>
          <Form.Label>&nbsp;</Form.Label>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={isPending}
            className={styles.confirmDetailsBtn}
          >
            Submit
          </Button>
        </Col>
      </Row>

      {errors ? (
        <Row>
          <Col>
            <Alert variant="danger" className={styles.errorAlert}>
              Fix errors above and try again
            </Alert>
          </Col>
        </Row>
      ) : null}

      <Row></Row>
    </Form>
  );
}
