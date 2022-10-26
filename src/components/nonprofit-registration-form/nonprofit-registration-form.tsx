import styles from './nonprofit-registration-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import * as fbq from 'app/tracking/fpixel';
import { registerNonprofit } from 'app/api';
import { useCancelToken, isRequestCancel } from 'app/hooks';
import { NonprofitRegistrationSuccess } from 'components/nonprofit-registration-form/registration-success/registration-success';
import { PhoneInput } from 'components/phone-input/phone-input';
import type { FormEvent } from 'react';

const ERROR_KEYS = Object.freeze({
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  EMAIL: 'email',
  PHONE_NUMBER: 'phone_number',
  ORGANIZATION_NAME: 'organization_name',
  URL: 'url',
  EIN_NUMBER: 'ein_number',
});
type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];

export function NonprofitRegistrationForm() {
  const [isPending, setIsPending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [url, setUrl] = useState('');
  const [einNumber, setEinNumber] = useState('');

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
        await registerNonprofit({
          firstName,
          lastName,
          email,
          phoneNumber,
          organizationName,
          url,
          einNumber,
          cancelToken,
        });

        fbq.event('Lead', { content_name: 'Nonprofit registration' });

        setIsPending(false);
        setIsRegistered(true);
        setErrors(null);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);
        setIsRegistered(false);
        setErrors(rejection?.response?.data);
      }
    },
    [
      isPending,
      firstName,
      lastName,
      email,
      phoneNumber,
      organizationName,
      url,
      einNumber,
    ]
  );

  const handleFormReset = useCallback(() => {
    setIsPending(false);
    setIsRegistered(false);
    setErrors(null);

    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setOrganizationName('');
    setUrl('');
    setEinNumber('');
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
    return <NonprofitRegistrationSuccess onDismiss={handleFormReset} />;
  }

  return (
    <Form
      onSubmit={handleFormSubmit}
      className={styles.nonProfitRegistrationForm}
    >
      <Row>
        <Col>
          <h2 className={styles.header}>Organization Information</h2>
        </Col>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Responsible Person</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
          controlId="firstName"
          className={styles.formGroup}
        >
          <Form.Label>First Name *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            isValid={getIsValid('first_name')}
            isInvalid={getIsInvalid('first_name')}
          />
          {getErrorsFeedback('first_name')}
        </Form.Group>
        <Form.Group
          as={Col}
          xs={6}
          controlId="lastName"
          className={styles.formGroup}
        >
          <Form.Label>Last Name *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            isValid={getIsValid('last_name')}
            isInvalid={getIsInvalid('last_name')}
          />
          {getErrorsFeedback('last_name')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="email"
          className={styles.formGroup}
        >
          <Form.Label>Email *</Form.Label>
          <Form.Control
            size="lg"
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={getIsValid('email')}
            isInvalid={getIsInvalid('email')}
          />
          {getErrorsFeedback('email')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="phoneNumber"
          className={styles.formGroup}
        >
          <Form.Label>Phone Number</Form.Label>
          <PhoneInput
            value={phoneNumber}
            inputProps={{ id: 'phoneNumber' }}
            inputClass="form-control-lg"
            isValid={getIsValid('phone_number')}
            isInvalid={getIsInvalid('phone_number')}
            onChange={(phone) => setPhoneNumber(phone)}
          />
          {getErrorsFeedback('phone_number')}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Organization Details</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          controlId="organizationName"
          className={styles.formGroup}
        >
          <Form.Label>Organization Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            isValid={getIsValid('organization_name')}
            isInvalid={getIsInvalid('organization_name')}
          />
          {getErrorsFeedback('organization_name')}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId="url" className={styles.formGroup}>
          <Form.Label>Organization Website</Form.Label>
          <Form.Control
            size="lg"
            type="url"
            placeholder=""
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            isValid={getIsValid('url')}
            isInvalid={getIsInvalid('url')}
          />
          {getErrorsFeedback('url')}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId="einNumber" className={styles.formGroup}>
          <Form.Label>EIN Number</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={einNumber}
            onChange={(e) => setEinNumber(e.target.value)}
            isValid={getIsValid('ein_number')}
            isInvalid={getIsInvalid('ein_number')}
          />
          {getErrorsFeedback('ein_number')}
        </Form.Group>
      </Row>

      {errors ? (
        <Row>
          <Col>
            <div className="text-danger">Fix errors above and try again</div>
          </Col>
        </Row>
      ) : null}

      <Row>
        <Col>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className={styles.confirmDetailsBtn}
          >
            Submit Info
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
