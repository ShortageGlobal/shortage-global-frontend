import styles from './create-account-form.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Loader, Eye, EyeOff } from 'react-feather';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useNotifications, isRequestCancel } from 'core/hooks';
import { createAccount } from 'core/api';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  email: 'email',
  password: 'password',
  confirmPassword: 'confirmPassword',
  agreedToTermsOfUse: 'agreedToTermsOfUse',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.email]: 'email',
  [INPUT_ID.password]: 'password',
  [INPUT_ID.confirmPassword]: 'confirm_password',
  [INPUT_ID.agreedToTermsOfUse]: 'agreed_to_terms_of_use',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

type CreateAccountFormProps = {
  onRegistered: () => void;
};

export function CreateAccountForm({ onRegistered }: CreateAccountFormProps) {
  const { showNotification } = useNotifications();
  const session = useSession();
  const router = useRouter();

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  // redirect from create account page if authenticated
  useEffect(() => {
    if (session?.status === 'authenticated') {
      const callbackUrl = router?.query?.callbackUrl || '/';
      const url = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
      router.replace(url);
    }
  }, [isAuthenticated, router?.query?.callbackUrl]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isPending || isAuthenticated) {
        return;
      }

      setIsPending(true);

      // use form instead of state because of problems with autofill
      const target = e.target as typeof e.target & {
        [INPUT_ID.email]: HTMLInputElement;
        [INPUT_ID.password]: HTMLInputElement;
        [INPUT_ID.confirmPassword]: HTMLInputElement;
        [INPUT_ID.agreedToTermsOfUse]: HTMLInputElement;
      };

      try {
        await createAccount({
          email: target[INPUT_ID.email].value,
          password: target[INPUT_ID.password].value,
          confirmPassword: target[INPUT_ID.confirmPassword].value,
          agreedToTermsOfUse: target[INPUT_ID.agreedToTermsOfUse].checked,
        });

        setErrors(null);
        onRegistered();
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);

        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejectionErrors);
        } else {
          setErrors(null);
          showNotification({
            isFailure: true,
            message: 'Failed to create account',
          });
        }
      }
    },
    [isPending, isAuthenticated, showNotification]
  );

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

  return (
    <Form onSubmit={handleFormSubmit} className={styles.form}>
      <Row>
        <Form.Group
          as={Col}
          controlId={INPUT_ID.email}
          className={styles.formGroup}
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            size="lg"
            type="email"
            name={INPUT_ID.email}
            required
            autoFocus
            isValid={getIsValid(ERROR_KEYS.email)}
            isInvalid={getIsInvalid(ERROR_KEYS.email)}
          />
          {getErrorsFeedback(ERROR_KEYS.email)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          controlId={INPUT_ID.password}
          className={styles.formGroup}
        >
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              size="lg"
              type={showPassword ? 'test' : 'password'}
              name={INPUT_ID.password}
              required
              isValid={getIsValid(ERROR_KEYS.password)}
              isInvalid={getIsInvalid(ERROR_KEYS.password)}
            />
            <Button
              variant=""
              className={classNames(styles.showPasswordBtn, {
                [styles.withFeedback]:
                  !!getIsInvalid(ERROR_KEYS.password) ||
                  !!getIsValid(ERROR_KEYS.password),
              })}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
            {getErrorsFeedback(ERROR_KEYS.password)}
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          controlId={INPUT_ID.confirmPassword}
          className={styles.formGroup}
        >
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              size="lg"
              type={showPassword ? 'test' : 'password'}
              name={INPUT_ID.confirmPassword}
              required
              isValid={getIsValid(ERROR_KEYS.confirmPassword)}
              isInvalid={getIsInvalid(ERROR_KEYS.confirmPassword)}
            />
            <Button
              variant=""
              className={classNames(styles.showPasswordBtn, {
                [styles.withFeedback]:
                  !!getIsInvalid(ERROR_KEYS.confirmPassword) ||
                  !!getIsValid(ERROR_KEYS.confirmPassword),
              })}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
            {getErrorsFeedback(ERROR_KEYS.confirmPassword)}
          </InputGroup>
        </Form.Group>
      </Row>

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
            isValid={getIsValid(ERROR_KEYS.agreedToTermsOfUse)}
            isInvalid={getIsInvalid(ERROR_KEYS.agreedToTermsOfUse)}
            feedback={errors?.[ERROR_KEYS.agreedToTermsOfUse]}
            feedbackType={
              getIsInvalid(ERROR_KEYS.agreedToTermsOfUse) ? 'invalid' : null
            }
          />
        </Form.Group>
      </Row>

      <Row>
        <Col>
          <Button
            type="submit"
            size="lg"
            disabled={isPending || isAuthenticated}
            className={styles.submitBtn}
          >
            {isPending ? (
              <Loader
                role="status"
                aria-hidden="true"
                className={animationStyles.rotate}
              />
            ) : null}
            <span>Submit</span>
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <div>
            Already have an account?{' '}
            <Link href="/account/sign-in/">Sign in</Link>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
