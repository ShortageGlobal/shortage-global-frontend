import styles from 'styles/pages/account/sign-in.module.scss';
import animationStyles from 'styles/animations.module.scss';
import classNames from 'classnames';
import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { Loader, Eye, EyeOff } from 'react-feather';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { wrapper } from 'core/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getSignInCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { FormEvent } from 'react';
import type { NextPageWithLayout } from 'pages/_app';
import { isRequestCancel } from 'core/hooks';

const SignInPage: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getSignInCrumb({ isActive: true })];
  }, []);

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // redirect from sign in page if authenticated
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
      };

      try {
        const response = await signIn('credentials', {
          email: target.email.value,
          password: target.password.value,
          redirect: false,
        });

        if (response.error) {
          // show error message if
          setErrorMessage(response.error);
          setIsPending(false);
        }
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setErrorMessage(
          'Operation failed. Try again and contact support if the problem persists.'
        );
        setIsPending(false);
      }
    },
    [isPending, isAuthenticated, router]
  );

  return (
    <>
      <Head>
        <title>Sign In | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.accountFormContainer}>
        <Row>
          <Col>
            <h2 className={styles.header}>Sign In</h2>
          </Col>
        </Row>

        <Form onSubmit={handleFormSubmit} className={styles.form}>
          <Row>
            <Form.Group as={Col} controlId="email" className={styles.formGroup}>
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
                  isInvalid={!!errorMessage}
                />
                <Button
                  variant=""
                  className={classNames(styles.showPasswordBtn, {
                    [styles.withFeedback]: !!errorMessage,
                  })}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </InputGroup>
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
                <span>Submit</span>
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <div>
                Don&apos;t have an account yet?{' '}
                <Link href="/account/create-account/">Create new account</Link>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mt-3">
                Forgot your password?{' '}
                <Link href="/account/forgot-password/">Reset password</Link>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default SignInPage;
