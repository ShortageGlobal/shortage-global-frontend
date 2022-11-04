import styles from './nonprofit-registration-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import * as fbq from 'core/tracking/fpixel';
import { registerNonprofit } from 'core/api';
import { useCancelToken, isRequestCancel } from 'core/hooks';
import { NonprofitRegistrationSuccess } from 'components/nonprofit-registration-form/registration-success/registration-success';
import { PhoneInput } from 'components/phone-input/phone-input';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  organizationName: 'organizationName',
  url: 'url',
  einNumber: 'einNumber',
  agreedToTermsOfUse: 'agreedToTermsOfUse',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.firstName]: 'first_name',
  [INPUT_ID.lastName]: 'last_name',
  [INPUT_ID.email]: 'email',
  [INPUT_ID.phoneNumber]: 'phone_number',
  [INPUT_ID.organizationName]: 'organization_name',
  [INPUT_ID.url]: 'url',
  [INPUT_ID.einNumber]: 'ein_number',
  [INPUT_ID.agreedToTermsOfUse]: 'agreed_to_terms_of_use',
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
  const [agreedToTermsOfUse, setAgreedToTermsOfUse] = useState(false);

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
          agreedToTermsOfUse,
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
      agreedToTermsOfUse,
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
    setAgreedToTermsOfUse(false);
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
          controlId={INPUT_ID.firstName}
          className={styles.formGroup}
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.firstName)}
            isInvalid={getIsInvalid(ERROR_KEYS.firstName)}
          />
          {getErrorsFeedback(ERROR_KEYS.firstName)}
        </Form.Group>
        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.lastName}
          className={styles.formGroup}
        >
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.lastName)}
            isInvalid={getIsInvalid(ERROR_KEYS.lastName)}
          />
          {getErrorsFeedback(ERROR_KEYS.lastName)}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.email}
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
            isValid={getIsValid(ERROR_KEYS.email)}
            isInvalid={getIsInvalid(ERROR_KEYS.email)}
          />
          {getErrorsFeedback(ERROR_KEYS.email)}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.phoneNumber}
          className={styles.formGroup}
        >
          <Form.Label>Phone Number</Form.Label>
          <PhoneInput
            value={phoneNumber}
            inputProps={{ id: 'phoneNumber' }}
            inputClass="form-control-lg"
            isValid={getIsValid(ERROR_KEYS.phoneNumber)}
            isInvalid={getIsInvalid(ERROR_KEYS.phoneNumber)}
            onChange={(phone) => setPhoneNumber(phone)}
          />
          {getErrorsFeedback(ERROR_KEYS.phoneNumber)}
        </Form.Group>
      </Row>

      {/* <header className={styles.sectionHeader}>
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
            isValid={getIsValid(ERROR_KEYS.organizationName)}
            isInvalid={getIsInvalid(ERROR_KEYS.organizationName)}
          />
          {getErrorsFeedback(ERROR_KEYS.organizationName)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId={INPUT_ID.url} className={styles.formGroup}>
          <Form.Label>Organization Website</Form.Label>
          <Form.Control
            size="lg"
            type="url"
            placeholder=""
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.url)}
            isInvalid={getIsInvalid(ERROR_KEYS.url)}
          />
          {getErrorsFeedback(ERROR_KEYS.url)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId={INPUT_ID.einNumber} className={styles.formGroup}>
          <Form.Label>EIN Number</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={einNumber}
            onChange={(e) => setEinNumber(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.einNumber)}
            isInvalid={getIsInvalid(ERROR_KEYS.einNumber)}
          />
          {getErrorsFeedback(ERROR_KEYS.einNumber)}
        </Form.Group>
      </Row> */}

      <Row>
        <Form.Group as={Col} controlId={INPUT_ID.agreedToTermsOfUse}>
          <Form.Check
            type="checkbox"
            id={INPUT_ID.agreedToTermsOfUse}
            name={INPUT_ID.agreedToTermsOfUse}
            label={
              <>
                <span>* I agree to the terms of use. </span>
                <Link
                  href="/terms-of-use/"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  View Terms of Use Policy
                </Link>
              </>
            }
            required
            checked={agreedToTermsOfUse}
            onChange={(e) => setAgreedToTermsOfUse(e.target.checked)}
            isValid={getIsValid(ERROR_KEYS.agreedToTermsOfUse)}
            isInvalid={getIsInvalid(ERROR_KEYS.agreedToTermsOfUse)}
            feedback={errors?.[ERROR_KEYS.agreedToTermsOfUse]}
            feedbackType={
              getIsInvalid(ERROR_KEYS.agreedToTermsOfUse) ? 'invalid' : null
            }
          />
        </Form.Group>
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
