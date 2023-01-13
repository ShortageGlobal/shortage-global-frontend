import styles from 'styles/pages/account/forgot-password.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { wrapper } from 'core/store';
import { requestPasswordReset } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForgotPasswordCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { FormEvent } from 'react';
import type { NextPageWithLayout } from 'pages/_app';
import { isRequestCancel } from 'core/hooks';

const ForgotPasswordPage: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getForgotPasswordCrumb({ isActive: true })];
  }, []);

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );

  const [isPending, setIsPending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // redirect from the "Forgot Password" page if authenticated
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
      const target = e.target as HTMLFormElement & {
        email: HTMLInputElement;
      };

      try {
        await requestPasswordReset({ email: target.email.value });
        setErrorMessage(null);
        setIsEmailSent(true);
        target.reset();
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setErrorMessage(
          'Operation failed. Try again and contact support if the problem persists.'
        );
        setIsPending(false);
        setIsEmailSent(false);
      }
    },
    [isPending, isAuthenticated, router]
  );

  const handleDismiss = useCallback(() => {
    setIsPending(false);
    setIsEmailSent(false);
  }, []);

  return (
    <>
      <Head>
        <title>Forgot Password | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      {isEmailSent ? (
        <Container className={styles.emailSentContainer}>
          <Row>
            <Col>
              <h2 className={styles.header}>Email sent</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>We sent you an email with the password reset instructions.</p>

              <p>
                If you didn&apos;t receive the email, please check your Spam
                folder.
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
              <h2 className={styles.header}>Forgot Password</h2>
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
                  isInvalid={!!errorMessage}
                />
              </Form.Group>
            </Row>

            {errorMessage ? (
              <Row>
                <Col>
                  <Alert variant="danger">{errorMessage}</Alert>
                </Col>
              </Row>
            ) : null}

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
                  <span>Send reset link</span>
                </Button>
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

export default ForgotPasswordPage;
