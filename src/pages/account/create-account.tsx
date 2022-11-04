import styles from 'styles/pages/account/create-account.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Loader, Eye, EyeOff } from 'react-feather';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { isRequestCancel } from 'core/hooks';
import { wrapper } from 'core/store';
import { createAccount } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getCreateAccountCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { FormEvent } from 'react';
import type { NextPageWithLayout } from 'pages/_app';

const ERROR_KEYS = Object.freeze({
  email: 'email',
  password: 'password',
  confirmPassword: 'confirm_password',
});
type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];

const CreateAccount: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getCreateAccountCrumb({ isActive: true })];
  }, []);

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
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
        email: HTMLInputElement;
        password: HTMLInputElement;
        confirmPassword: HTMLInputElement;
      };

      try {
        await createAccount({
          email: target.email.value,
          password: target.password.value,
          confirmPassword: target.confirmPassword.value,
        });

        setErrors(null);
        setIsRegistered(true);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);
        setIsRegistered(false);

        if (rejection?.response?.data) {
          setErrors(rejection?.response?.data);
        } else {
          // TODO: show notification about failure
        }
      }
    },
    [isPending, isAuthenticated, router]
  );

  const handleDismiss = useCallback(() => {
    setIsPending(false);
    setIsRegistered(false);
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

  return (
    <>
      <Head>
        <title>Create Account | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      {isRegistered ? (
        <Container className={styles.registrationSuccessContainer}>
          <Row>
            <Col>
              <h2 className={styles.header}>Thank you for registering 💚</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>We&apos;re excited to see you join the Shortage community.</p>

              <p>
                We sent you a confirmation email, it will be in your inbox
                shortly. After confirmation you will be able to sign in to your
                account.
              </p>

              <Button
                variant="outline-dark"
                onClick={handleDismiss}
                className={styles.dismissBtn}
              >
                Got it
              </Button>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container className={styles.accountFormContainer}>
          <Row>
            <Col>
              <h2 className={styles.header}>Create Account</h2>
            </Col>
          </Row>
          <Form onSubmit={handleFormSubmit} className={styles.form}>
            <Row>
              <Form.Group
                as={Col}
                controlId="email"
                className={styles.formGroup}
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  size="lg"
                  type="email"
                  name="email"
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
                controlId="password"
                className={styles.formGroup}
              >
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    size="lg"
                    type={showPassword ? 'test' : 'password'}
                    name="password"
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
                controlId="confirmPassword"
                className={styles.formGroup}
              >
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    size="lg"
                    type={showPassword ? 'test' : 'password'}
                    name="confirmPassword"
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
        </Container>
      )}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default CreateAccount;
